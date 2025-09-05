import React, { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../api/api"

const Tag = ({ text }) => (
  <div className="w-fit rounded-3xl text-xs bg-[rgba(143,224,253,0.6)] py-2 px-6 text-[#04547E]">
    {text}
  </div>
)

const StudentPage = () => {
  const { url } = useParams()

  const [test, setTest] = useState(null)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(null)
  const [timeUp, setTimeUp] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // 1) Загружаем тест по URL
  useEffect(() => {
    const fetchTest = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/tests/${url}`)
        setTest(res.data)

        if (res.data?.duration && res.data.duration > 0) {
          setTimeLeft(res.data.duration * 60)
        } else {
          setTimeLeft(null)
        }
      } catch (err) {
        console.error(err)
        setError("Не удалось загрузить тест. Пожалуйста, проверьте ссылку.")
      } finally {
        setLoading(false)
      }
    }

    fetchTest()
  }, [url])

  // 2) Таймер
  useEffect(() => {
    if (timeLeft === null) return
    if (timeLeft <= 0) {
      setTimeUp(true)
      return
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => (typeof prev === "number" ? prev - 1 : prev))
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (seconds) => {
    const m = Math.floor((seconds || 0) / 60)
    const s = (seconds || 0) % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const handleAnswerChange = (qIndex, value) => {
    if (timeUp || result) return
    setAnswers((prev) => ({ ...prev, [qIndex]: value }))
  }

  const multipleQuestions = useMemo(
    () => (test?.questions || []).filter((q) => q?.answerType === "multiple"),
    [test]
  )

  // 3) Отправка результатов (все ответы)
  const handleSubmit = async () => {
    if (!test?._id || submitting) return

    const payload = {
      answers: (test?.questions || []).map((q, i) => ({
        questionId: q._id,
        selectedAnswer: answers[i] || "",
      })),
    }

    try {
      setSubmitting(true)
      const res = await api.post(`/results/${test._id}/submit`, payload)
      setResult(res.data)
      setTimeUp(true)
    } catch (err) {
      console.error("Ошибка при отправке результатов:", err)
      setError("Не удалось отправить результаты.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="text-center mt-10">Загрузка...</div>
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>
  if (!test) return <div className="text-center mt-10">Тест не найден</div>

  return (
    <div className="w-full h-full flex justify-center items-start p-4">
      <div className="w-[90%] bg-white/50 rounded-3xl p-8 flex flex-col gap-6">
        {/* Шапка */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-[#04547E]">{test.title}</h1>
          <div className="flex items-center gap-2">
            <Tag text={`${test.questions?.length || 0} вопросов`} />
            {test.duration > 0 ? (
              <Tag text={`Осталось: ${formatTime(timeLeft || 0)}`} />
            ) : (
              <Tag text="Без ограничения по времени" />
            )}
          </div>
        </div>

        {/* РЕЗУЛЬТАТЫ после отправки */}
        {result ? (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-[#04547E]">
              Результат: {result.score} / {multipleQuestions.length}
            </h2>

            {multipleQuestions.map((q, i) => {
              const userAnswer = (result.answers || []).find(
                (a) => a.questionId === q._id
              )
              const isCorrect = userAnswer?.selectedAnswer === q.correctAnswer

              return (
                <div
                  key={q._id || i}
                  className={`p-4 rounded-xl border ${
                    isCorrect
                      ? "border-green-400 bg-green-50"
                      : "border-red-400 bg-red-50"
                  }`}
                >
                  <p className="font-medium text-[#04547E] mb-2">
                    {i + 1}. {q.question}
                  </p>
                  <div className="text-sm">
                    <p>
                      Ваш ответ:{" "}
                      <span className="font-semibold">
                        {userAnswer?.selectedAnswer ?? "—"}
                      </span>
                    </p>
                    <p>
                      Правильный ответ:{" "}
                      <span className="font-semibold">{q.correctAnswer}</span>
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <>
            {/* ПРОХОЖДЕНИЕ ТЕСТА */}
            {(test.questions || []).map((q, i) => (
              <div
                key={q._id || i}
                className="bg-white/50 p-6 rounded-2xl shadow-[0_2px_20px_0_rgba(0,0,0,0.10)]"
              >
                <p className="font-medium text-[#04547E] mb-3">
                  {i + 1}. {q.question}
                </p>

                {q.answerType === "multiple" && Array.isArray(q.options) && (
                  <ul className="flex flex-col gap-2">
                    {q.options.map((opt, idx) => (
                      <li key={idx}>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`q-${i}`}
                            value={opt}
                            checked={answers[i] === opt}
                            onChange={() => handleAnswerChange(i, opt)}
                            disabled={timeUp}
                            className="w-4 h-4 cursor-pointer accent-[rgba(143,224,253,0.6)]"
                          />
                          <span
                            className={`text-[#04547E] ${
                              timeUp ? "opacity-50" : ""
                            }`}
                          >
                            {opt}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                )}

                {q.answerType === "open" && (
                  <textarea
                    value={answers[i] || ""}
                    onChange={(e) => handleAnswerChange(i, e.target.value)}
                    placeholder="Ваш ответ"
                    className="mt-2 w-full p-3 text-sm text-[#04547E] bg-white rounded-xl border border-gray-200 shadow-inner resize-none"
                    rows={3}
                    disabled={timeUp}
                  />
                )}
              </div>
            ))}

            <button
              onClick={handleSubmit}
              disabled={timeUp || submitting}
              className={`w-full h-[44px] mt-4 rounded-xl text-[#04547E] font-medium ${
                timeUp || submitting
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[rgba(143,224,253,0.6)]"
              }`}
            >
              {timeUp ? "Время вышло" : submitting ? "Отправка..." : "Отправить тест"}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default StudentPage
