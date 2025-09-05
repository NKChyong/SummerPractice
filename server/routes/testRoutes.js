import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { createTest, getTests, getTestByUrl } from '../controllers/testController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tests
 *   description: Управление тестами
 */

/**
 * @swagger
 * /api/tests:
 *   post:
 *     summary: Создание нового теста
 *     tags: [Tests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - questions
 *             properties:
 *               title:
 *                 type: string
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question:
 *                       type: string
 *                     options:
 *                       type: array
 *                       items:
 *                         type: string
 *                     correctAnswer:
 *                       type: string
 *                     answerType:
 *                       type: string
 *                       enum: [multiple, open]
 *     responses:
 *       201:
 *         description: Тест создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Test'
 */
router.route('/').post(protect, createTest);

/**
 * @swagger
 * /api/tests:
 *   get:
 *     summary: Получить все тесты текущего учителя
 *     tags: [Tests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список тестов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Test'
 */
router.route('/').get(protect, getTests);


/**
 * @swagger
 * /api/tests/{url}:
 *   get:
 *     summary: Получить тест по его URL
 *     tags: [Tests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: url
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Уникальный URL теста
 *     responses:
 *       200:
 *         description: Тест с указанным URL
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Test'
 *       404:
 *         description: Тест не найден
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.route('/:url').get(protect, getTestByUrl);

export default router;
