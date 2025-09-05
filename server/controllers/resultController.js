import Result from '../models/Result.js';
import Test from '../models/Test.js';

/**
 * @swagger
 * tags:
 *   name: Results
 *   description: Результаты тестов
 */

/**
 * @swagger
 * /api/results/{testId}/submit:
 *   post:
 *     summary: Отправить результаты теста
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
 */
const submitTest = async (req, res) => {
  try {
    const { answers } = req.body;
    const { testId } = req.params;
    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ message: 'Тест не найден' });

    let score = 0;
    test.questions.forEach((q) => {
      const given = answers.find((a) => a.questionId === q._id.toString());
      if (given && given.selectedAnswer === q.correctAnswer) score++;
    });

    const result = new Result({ student: req.user._id, test: testId, answers, score });
    await result.save();
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/results/{testId}/results:
 *   get:
 *     summary: Получить все результаты текущего пользователя по тесту
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
const getResults = async (req, res) => {
  try {
    const { testId } = req.params;
    const results = await Result.find({ test: testId, student: req.user._id }).populate('test', 'title');
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/**
 * @swagger
 * /api/results/{testId}/results:
 *   get:
 *     summary: Получить все результаты теста по его ID (для учителей)
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
const getAllResultsByTestId = async (req, res) => {
  try {
    const { testId } = req.params;
    const results = await Result.find({ test: testId });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { submitTest, getResults, getAllResultsByTestId };
