import dotenv from 'dotenv';
import path from 'path';

// Подключаем .env из корня проекта
dotenv.config({ path: path.resolve('./.env') });

// Проверяем, что переменные окружения подхватились
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('MONGO_URI:', process.env.MONGO_URI);

import express from 'express';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import testRoutes from './routes/testRoutes.js';
import resultRoutes from './routes/resultRoutes.js';
import { swaggerSpec, swaggerUi } from './swagger/swaggerConfig.js';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// Подключаем MongoDB
connectDB();

// Swagger документация
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Роуты
app.use('/api/auth', authRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/results', resultRoutes);

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
