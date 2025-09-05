import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Локальный адрес MongoDB
    await mongoose.connect('mongodb://127.0.0.1:27017/ChiongSummerPractice');
    console.log('MongoDB подключен');
  } catch (err) {
    console.error('Ошибка подключения к MongoDB:', err);
    process.exit(1);
  }
};

export default connectDB;
