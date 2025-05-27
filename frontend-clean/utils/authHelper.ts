import AsyncStorage from '@react-native-async-storage/async-storage';

export const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

export const getUserIdFromToken = async () => {
  const token = await getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id;
  } catch (err) {
    console.error("Token çözümleme hatası:", err);
    return null;
  }
};

export const logout = async () => {
  await AsyncStorage.removeItem('token');
};
