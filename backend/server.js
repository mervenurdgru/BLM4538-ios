import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sql, poolPromise } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'my_super_secret_key';

// ✅ Veritabanı bağlantı testi
(async () => {
  try {
    const pool = await poolPromise;
    await pool.query('SELECT 1');
    console.log("✅ Veritabanı bağlantısı başarılı");
  } catch (err) {
    console.error("❌ Veritabanı bağlantısı başarısız:", err.message);
  }
})();

// ✅ Token kontrol middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: "Token eksik" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: "Token geçersiz" });
    req.user = user;
    next();
  });
}

// 📝 Kullanıcı Kaydı
app.post('/api/users/register', async (req, res) => {
  try {
    const { KullaniciAdi, Sifre, Email } = req.body;
    if (!KullaniciAdi || !Sifre || !Email) return res.status(400).json({ message: "Eksik alanlar" });

    const pool = await poolPromise;
    const check = await pool.request().input("KullaniciAdi", sql.VarChar, KullaniciAdi)
      .query("SELECT UyeID FROM Uyeler WHERE KullaniciAdi = @KullaniciAdi");
    if (check.recordset.length > 0) return res.status(400).json({ message: "Kullanıcı adı mevcut" });

    const hashed = await bcrypt.hash(Sifre, 10);
    const result = await pool.request()
      .input("KullaniciAdi", sql.VarChar, KullaniciAdi)
      .input("Sifre", sql.VarChar, hashed)
      .input("Email", sql.VarChar, Email)
      .input("KayitTarihi", sql.DateTime, new Date())
      .query("INSERT INTO Uyeler (KullaniciAdi, Sifre, Email, KayitTarihi) OUTPUT INSERTED.UyeID VALUES (@KullaniciAdi, @Sifre, @Email, @KayitTarihi)");
    const userId = result.recordset[0].UyeID;
    const token = jwt.sign({ id: userId, KullaniciAdi }, JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token });
  } catch (err) {
    console.error("Kayıt Hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// 🔑 Kullanıcı Girişi
app.post('/api/users/login', async (req, res) => {
  try {
    const { KullaniciAdi, Sifre } = req.body;
    const pool = await poolPromise;
    const result = await pool.request().input("KullaniciAdi", sql.VarChar, KullaniciAdi)
      .query("SELECT * FROM Uyeler WHERE KullaniciAdi = @KullaniciAdi");
    if (result.recordset.length === 0) return res.status(400).json({ message: "Kullanıcı yok" });

    const user = result.recordset[0];
    const match = await bcrypt.compare(Sifre, user.Sifre);
    if (!match) return res.status(400).json({ message: "Şifre yanlış" });

    const token = jwt.sign({ id: user.UyeID, KullaniciAdi }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    console.error("Giriş Hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

app.get('/api/products/:barkod', async (req, res) => {
  try {
    const { barkod } = req.params; // barkod URL'den alınır
    const pool = await poolPromise;

    const result = await pool.request()
      .input('Barkod', sql.VarChar, barkod) // 🔥 Parametre doğru veriliyor
      .query('SELECT * FROM Products WHERE barcode = @Barkod');

    if (result.recordset.length === 0)
      return res.status(404).json({ message: "Ürün bulunamadı." });

    res.json({ urun: result.recordset[0] });
  } catch (err) {
    console.error("Ürün Sorgu Hatası:", err);
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
});

app.post('/api/users/favorites/add', authenticateToken, async (req, res) => {
  try {
    const { ProductID } = req.body;
    console.log('Favori Ekleme:', { UyeID: req.user.id, ProductID });  // LOG EKLENDİ
    const pool = await poolPromise;
    await pool.request()
      .input('UyeID', sql.Int, req.user.id)
      .input('ProductID', sql.Int, ProductID)
      .query("INSERT INTO Favoriler (UyeID, ProductID) VALUES (@UyeID, @ProductID)");
    res.json({ message: "Favori eklendi" });
  } catch (err) {
    console.error("Favori Ekleme Hatası:", err);  // Hata Mesajı
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
});

app.post('/api/users/history/add', authenticateToken, async (req, res) => {
  try {
    const { ProductID, Barkod } = req.body;
    const UyeID = req.user.id;

    if (!ProductID || !Barkod) {
      return res.status(400).json({ message: "Eksik veri: ProductID veya Barkod" });
    }

    const pool = await poolPromise;
    const result = await pool.request()
      .input('UyeID', sql.Int, UyeID)
      .input('ProductID', sql.Int, ProductID)
      .input('Barkod', sql.VarChar, Barkod)
      .input('TaramaTarihi', sql.DateTime, new Date())
      .query("INSERT INTO History (UyeID, ProductID, Barkod, TaramaTarihi) VALUES (@UyeID, @ProductID, @Barkod, @TaramaTarihi)");

    res.json({ message: "Geçmişe kaydedildi" });
  } catch (err) {
    console.error("Geçmiş Ekleme Hatası:", err);
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
});



// Favorileri Getir (Products join ile)
app.get('/api/users/favorites', authenticateToken, async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('UyeID', sql.Int, req.user.id)
      .query("SELECT f.ProductID, p.productName AS ProductName FROM Favoriler f JOIN Products p ON f.ProductID = p.id WHERE f.UyeID = @UyeID");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
});

// 💾 Geçmişi Getir (Products join ile)
app.get('/api/users/history', authenticateToken, async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('UyeID', sql.Int, req.user.id)
      .query("SELECT h.ProductID, p.productName AS ProductName, h.Barkod, h.TaramaTarihi FROM History h JOIN Products p ON h.ProductID = p.id WHERE h.UyeID = @UyeID ORDER BY h.TaramaTarihi DESC");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
});

// 🚀 Sunucu Başlat
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend ${PORT} portunda`));
