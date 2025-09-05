import express from 'express';
import { registerUser, loginUser, getMe } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Пользователи и аутентификация
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [teacher, student]
 *     responses:
 *       201:
 *         description: Успешная регистрация
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Пользователь уже существует
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Логин пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успешный логин
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Неверные учетные данные
 */
router.post('/login', loginUser);


/**
 * @swagger
 * /api/auth/me:
 *  get:
 *      summary: Получение информации о текущем пользователе
 *      tags: [Auth]
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Успешное получение информации
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      _id:
 *                          type: string
 *                      username:
 *                          type: string
 *                      role:
 *                          type: string
 *          401:
 *              description: Нет токена, или токен недействителен
 */
router.get('/me', protect, getMe);

export default router;
