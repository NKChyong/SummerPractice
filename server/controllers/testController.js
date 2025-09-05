import Test from '../models/Test.js';
import { v4 as uuidv4 } from 'uuid';

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
 *     summary: Создать новый тест
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
 *               duration:
 *                 type: number
 *                 description: Время прохождения теста в минутах (0 = без ограничения)
 *                 example: 30
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
 */
export const createTest = async (req, res) => {
  const { title, questions, duration } = req.body;
  const test = new Test({
    title,
    teacher: req.user._id,
    questions,
    duration: duration || 0,
    url: uuidv4()
  });
  await test.save();
  res.status(201).json(test);
};


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
export const getTests = async (req, res) => {
  const tests = await Test.find({ teacher: req.user._id });
  res.json(tests);
};



/**
 * @swagger
 * /api/tests/{url}:
 *   get:
 *     summary: Получить тест по его url
 *     tags: [Tests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Тест с выбранным id
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Test'
 */
export const getTestByUrl = async (req, res) => {
  try {
    const test = await Test.findOne({ url: req.params.url });

    if (!test) {
      return res.status(404).json({ message: 'Тест не найден' });
    }

    res.json(test);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};
