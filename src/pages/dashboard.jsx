import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

const Tag = ({ text }) => (
  <div className="w-fit rounded-3xl text-xs bg-[rgba(143,224,253,0.6)] py-2 px-6 text-[#04547E]">
    {text}
  </div>
)

const DashboardPage = () => {
  const navigate = useNavigate()
  const [testUrl, setTestUrl] = useState("")

  const handleGoToTest = () => {
    if (!testUrl.trim()) return
    navigate(`/test/${testUrl.trim()}`)
  }

  return (
    <div className="w-full h-full flex justify-center items-center p-4">
      <div className="w-[90%] max-w-[600px] bg-white/50 rounded-3xl p-8 shadow-[0_2px_20px_0_rgba(0,0,0,0.10)] flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-[#04547E]">
          Вы вошли как студент
        </h1>
        <p className="text-[#04547E] text-sm">
          Введите ссылку на тест, чтобы начать прохождение:
        </p>

        <input
          type="text"
          placeholder="Введите ссылку на тест"
          value={testUrl}
          onChange={(e) => setTestUrl(e.target.value)}
          className="w-full p-3 rounded-xl bg-white text-[#04547E] placeholder:text-[#04547E] font-light focus:outline-none focus:ring-2 focus:ring-[rgba(143,224,253,0.6)]"
        />

        <button
          onClick={handleGoToTest}
          disabled={!testUrl.trim()}
          className={`w-full h-[44px] mt-2 rounded-xl text-[#04547E] font-medium ease-in ${
            !testUrl.trim()
              ? "bg-white cursor-not-allowed"
              : "bg-[rgba(143,224,253,0.6)]"
          }`}
        >
          Перейти к тесту
        </button>

        <div className="flex gap-2 mt-4">
          <Tag text="Введите точную ссылку, например: abc123" />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
