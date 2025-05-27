// db.js
import sql from 'mssql';

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: true,
    trustServerCertificate: true, // Gerekli güvenlik ayarı
  },
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log('✅ Database connection successful');
    return pool;
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
    throw err;
  });

export { sql, poolPromise };
