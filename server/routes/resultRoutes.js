import express from 'express';
import { getAllResultsByTestId, getResults, submitTest } from '../controllers/resultController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Results
 *   description: Работа с результатами тестов
 */

/**
 * @swagger
 * /api/results/{testId}/submit:
 *   post:
 *     summary: Отправка результатов теста
 *     tags: [Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: testId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID теста
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId:
 *                       type: string
 *                     selectedAnswer:
 *                       type: string
 *     responses:
 *       201:
 *         description: Результат сохранен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Result'
 *       404:
 *         description: Тест не найден
 */
router.post('/:testId/submit', protect, submitTest);

/**
 * @swagger
 * /api/results/{testId}/results:
 *   get:
 *     summary: Получить результаты теста текущего пользователя
 *     tags: [Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: testId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID теста
 *     responses:
 *       200:
 *         description: Список результатов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Result'
 */
router.get('/:testId/results', protect, getResults);


/**
 * @swagger
 * /api/results/{testId}/results/all:
 *   get:
 *     summary: Получить результаты теста по ID теста (для учителей)
 *     tags: [Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: testId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID теста
 *     responses:
 *       200:
 *         description: Список результатов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Result'
 */
router.get('/:testId/results/all', protect, getAllResultsByTestId);






export default router;
