import copy_link from "../assets/svg_icons/copy_link.svg"
import { useState, useEffect } from "react"
import api from "../api/api"

const Tag = ({ text }) => (
  <div className="w-fit rounded-3xl text-xs bg-[rgba(143,224,253,0.6)] py-2 px-6 text-[#04547E]">
    {text}
  </div>
)

const TestCard = ({ test, onClick, expanded, results }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(test.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error("Ошибка копирования:", err)
    }
  }

  return (
    <div
      className={`w-full bg-white/50 rounded-2xl p-4 flex flex-col gap-2 shadow-[0_2px_20px_0_rgba(0,0,0,0.10)] transition-transform hover:scale-[1.01] cursor-pointer`}
    >
      {/* Верхний блок: название и копирование */}
      <div className="flex justify-between items-center">
        <div
          className="text-[#04547E] font-semibold flex-1 pr-2"
          onClick={onClick}
        >
          {test.title}
        </div>
        <img
          className="w-6 h-6 ml-2 cursor-pointer"
          src={copy_link}
          alt="copy link"
          onClick={handleCopy}
        />
      </div>

      {/* Нижний блок: количество вопросов и количество ответов */}
      <div className="flex flex-wrap gap-2 mt-2">
        <Tag text={`${test.questions.length} вопросов`} />
        <Tag text={`${test.answersCount || 0} ответов`} />
      </div>

      {/* Результаты студентов */}
      {expanded && results?.length > 0 && (
        <div className="mt-4 border-t border-gray-200 pt-4 flex flex-col gap-2 max-h-60 overflow-y-auto">
          {results.map((res) => (
            <div
              key={res._id}
              className="p-3 rounded-xl bg-white/70 border border-gray-200 shadow-inner text-sm flex flex-col gap-1"
            >
              <p>
                Студент: <span className="font-medium">{res.student}</span>
              </p>
              <p>Баллы: {res.score}</p>
              <div className="ml-4 mt-1 flex flex-col gap-1">
                {res.answers.map((a) => {
                  const question = test.questions.find((q) => q._id === a.questionId)
                  const questionText = question ? question.question : "Вопрос удалён"
                  return (
                    <p key={a._id}>
                      Вопрос: {questionText} — Ответ: {a.selectedAnswer}
                    </p>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Скопировано */}
      {copied && (
        <div className="mt-2 text-sm text-green-600 font-medium">Скопировано!</div>
      )}
    </div>
  )
}

const TeacherPage = () => {
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [expandedTestId, setExpandedTestId] = useState(null)
  const [selectedTestResults, setSelectedTestResults] = useState({})

  // --- форма создания теста ---
  const [testTitle, setTestTitle] = useState("")
  const [testTime, setTestTime] = useState("30:00")
  const [questionType, setQuestionType] = useState("single")
  const [questionText, setQuestionText] = useState("")
  const [answers, setAnswers] = useState([
    { text: "Введите первый вариант ответа", isCorrect: false },
    { text: "Затем второй вариант ответа", isCorrect: false },
    { text: "И наконец третий вариант ответа", isCorrect: false },
    { text: "После этого выберите правильный ответ/ответы", isCorrect: false },
  ])
  const [questions, setQuestions] = useState([])
  const [previewMode, setPreviewMode] = useState(false)
  const [creating, setCreating] = useState(false)

  // --- загрузка тестов и количества ответов ---
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await api.get("/tests")
        const testsData = Array.isArray(res.data) ? res.data : []

        // для каждого теста подгружаем количество ответов
        const testsWithCounts = await Promise.all(
          testsData.map(async (t) => {
            try {
              const resultsRes = await api.get(`/results/${t._id}/results/all`)
              return { ...t, answersCount: resultsRes.data.length }
            } catch {
              return { ...t, answersCount: 0 }
            }
          })
        )
        setTests(testsWithCounts)
      } catch (err) {
        console.error("Ошибка при загрузке тестов:", err)
        setError("Не удалось загрузить тесты")
      } finally {
        setLoading(false)
      }
    }
    fetchTests()
  }, [])

  const handleTestClick = async (testId) => {
    if (expandedTestId === testId) {
      setExpandedTestId(null)
      return
    }
    setExpandedTestId(testId)
    if (selectedTestResults[testId]) return

    try {
      const res = await api.get(`/results/${testId}/results/all`)
      setSelectedTestResults((prev) => ({ ...prev, [testId]: res.data }))
    } catch (err) {
      console.error("Ошибка при загрузке результатов:", err)
      setSelectedTestResults((prev) => ({ ...prev, [testId]: [] }))
    }
  }

  const handleAnswerChange = (index, value) => {
    const updated = [...answers]
    updated[index].text = value
    setAnswers(updated)
  }

  const toggleCorrectAnswer = (index) => {
    const updated = [...answers]
    updated[index].isCorrect = !updated[index].isCorrect
    setAnswers(updated)
  }

  const handleAddQuestion = () => {
    if (!questionText.trim()) return
    const newQuestion = {
      type: questionType,
      text: questionText,
      answers: questionType === "single" ? [...answers] : [],
    }
    setQuestions([...questions, newQuestion])
    setQuestionText("")
    setAnswers([
      { text: "Введите первый вариант ответа", isCorrect: false },
      { text: "Затем второй вариант ответа", isCorrect: false },
      { text: "И наконец третий вариант ответа", isCorrect: false },
      { text: "После этого выберите правильный ответ/ответы", isCorrect: false },
    ])
  }

  const handleDeleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const handleCreateTest = async () => {
    if (!testTitle.trim() || questions.length === 0) {
      alert("Введите название теста и добавьте хотя бы один вопрос")
      return
    }

    const formattedQuestions = questions.map((q) => {
      if (q.type === "single") {
        return {
          question: q.text,
          options: q.answers.map((a) => a.text),
          correctAnswer: q.answers.find((a) => a.isCorrect)?.text || "",
          answerType: "multiple",
        }
      } else {
        return {
          question: q.text,
          options: [],
          correctAnswer: "",
          answerType: "open",
        }
      }
    })

    const newTest = {
      title: testTitle,
      questions: formattedQuestions,
    }

    try {
      setCreating(true)
      const res = await api.post("/tests", newTest)
      setTests([...tests, { ...res.data, answersCount: 0 }])
      setTestTitle("")
      setTestTime("30:00")
      setQuestions([])
      setPreviewMode(false)
      alert("Тест успешно создан!")
    } catch (err) {
      console.error("Ошибка при создании теста:", err.response?.data || err.message)
      alert("Не удалось создать тест")
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="w-full h-full flex justify-center items-start p-4">
      <div className="w-[90%] pt-20 vgap-20 bg-white/50 rounded-3xl min-h-[90vh] flex flex-wrap justify-around items-start">
        {/* левая колонка: тесты */}
        <div className="w-full min-w-[340px] max-w-[45%]">
          <div className="flex gap-4 mb-10">
            <Tag text="Мои тесты" />
            <Tag text="Нажмите на тест для подробностей" />
          </div>
          <div
            className="relative h-fit overflow-y-auto pr-2 hide-scrollbar"
            style={{
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskSize: "100% 100%",
            }}
          >
            <div className="flex flex-col gap-4 py-6">
              {loading ? (
                <p className="text-center text-gray-500">Загрузка...</p>
              ) : error ? (
                <p className="text-center text-red-500">{error}</p>
              ) : tests.length === 0 ? (
                <p className="text-center text-gray-500">У вас ещё нет тестов</p>
              ) : (
                tests.map((test) => (
                  <TestCard
                    key={test._id}
                    test={test}
                    onClick={() => handleTestClick(test._id)}
                    expanded={expandedTestId === test._id}
                    results={selectedTestResults[test._id]}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* правая колонка: форма создания теста */}
        <div className="w-full min-w-[400px] max-w-[45%] text-[#04547E] cursor-pointer">
          <div className="w-full shadow-[0_2px_20px_0_rgba(0,0,0,0.10)] h-fit relative bg-white/50 rounded-2xl p-8 flex flex-col justify-center">
            {!previewMode ? (
              <>
                <div className="flex justify-between gap-2">
                  <input
                    placeholder="Введите название теста"
                    value={testTitle}
                    onChange={(e) => setTestTitle(e.target.value)}
                    className="w-[65%] placeholder:text-[#04547E] font-light pl-4 text-s rounded-xl bg-white h-[40px]"
                  />
                  <input
                    type="text"
                    placeholder="30:00"
                    value={testTime}
                    onChange={(e) => setTestTime(e.target.value)}
                    className="w-[30%] rounded-xl bg-white h-[40px] text-center"
                  />
                </div>

                <div className="flex justify-between mt-4">
                  <div
                    onClick={() => setQuestionType("single")}
                    className={
                      (questionType === "single"
                        ? "bg-[rgba(143,224,253,0.60)] "
                        : "bg-white ") +
                      "text-s transition cursor-pointer flex items-center justify-center rounded-xl font-light w-[48%] py-2 text-[#04547E]"
                    }
                  >
                    Вопрос с выбором
                  </div>
                  <div
                    onClick={() => setQuestionType("open")}
                    className={
                      (questionType === "open"
                        ? "bg-[rgba(143,224,253,0.60)] "
                        : "bg-white ") +
                      "text-s transition cursor-pointer flex items-center justify-center rounded-xl font-light w-[48%] py-2 text-[#04547E]"
                    }
                  >
                    Развернутый ответ
                  </div>
                </div>

                <input
                  placeholder="Введите вопрос"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full placeholder:text-[#04547E] font-light pl-4 mt-4 text-s rounded-xl bg-white h-[40px]"
                />

                {questionType === "single" && (
                  <div className="mt-4 flex flex-col gap-2">
                    {answers.map((answer, index) => (
                      <label
                        key={index}
                        className="flex items-center gap-2 rounded-xl px-6 py-0.5"
                      >
                        <input
                          type="checkbox"
                          checked={answer.isCorrect}
                          onChange={() => toggleCorrectAnswer(index)}
                          className="rounded-md bg-white checked:bg-[rgba(143,224,253,0.6)] appearance-none cursor-pointer w-4 h-4 mr-2 p-1 border border-gray-400"
                        />
                        <input
                          type="text"
                          value={answer.text}
                          onChange={(e) =>
                            handleAnswerChange(index, e.target.value)
                          }
                          className="flex-1 outline-none text-sm text-[#04547E] bg-transparent font-light"
                        />
                      </label>
                    ))}
                  </div>
                )}

                <button
                  onClick={handleAddQuestion}
                  className="w-full h-[44px] rounded-xl mt-4 bg-[rgba(143,224,253,0.6)]"
                >
                  Добавить вопрос
                </button>

                <button
                  onClick={() => setPreviewMode(true)}
                  className="w-full h-[44px] rounded-xl mt-4 bg-white"
                >
                  Предпросмотр
                </button>
                <button
                  onClick={handleCreateTest}
                  disabled={creating}
                  className="w-full h-[44px] rounded-xl mt-2 bg-[rgba(143,224,253,0.6)] disabled:opacity-50"
                >
                  {creating ? "Создание..." : "Создать тестирование"}
                </button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-medium mb-2">
                  {testTitle || "Без названия"}
                </h2>
                <p className="text-sm mb-4">Время на тест: {testTime}</p>

                {questions.length === 0 ? (
                  <p className="text-sm">Вы ещё не добавили вопросов</p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {questions.map((q, i) => (
                      <div
                        key={i}
                        className="relative p-4 bg-white rounded-xl shadow text-sm"
                      >
                        <button
                          onClick={() => handleDeleteQuestion(i)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 font-bold"
                        >
                          ×
                        </button>

                        <p className="mb-2 font-medium">
                          {i + 1}. {q.text}
                        </p>
                        {q.type === "single" &&
                          q.answers.map((a, idx) => (
                            <p
                              key={idx}
                              className={
                                "ml-4 " +
                                (a.isCorrect
                                  ? "text-green-600 font-semibold"
                                  : "text-gray-700")
                              }
                            >
                              - {a.text}
                            </p>
                          ))}
                        {q.type === "text" && (
                          <p className="ml-4 italic text-gray-500">
                            (Ответ в свободной форме)
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => setPreviewMode(false)}
                  className="w-full h-[44px] rounded-xl mt-4 bg-[rgba(143,224,253,0.6)]"
                >
                  Вернуться к редактированию
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherPage
