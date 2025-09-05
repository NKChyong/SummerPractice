import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import advantage_1 from "../assets/svg_icons/advantage_1.svg"
import advantage_2 from "../assets/svg_icons/advantage_2.svg"
import advantage_3 from "../assets/svg_icons/advantage_3.svg"

import axios from "axios"
import Cookies from "js-cookie"

const LoginInterface = () => {
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("") // по умолчанию ученик
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleLogin = async () => {
        setLoading(true)
        setError("")
        try {
            // шаг 1: логинимся
            const res = await axios.post("http://localhost:5000/api/auth/login", {
                username: login,
                password
            })

            const token = res.data.token
            Cookies.set("token", token, { expires: 7 })

            // шаг 2: получаем данные о пользователе
            const meRes = await axios.get("http://localhost:5000/api/auth/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const userRole = meRes.data.role
            Cookies.set("role", userRole, { expires: 7 })

            // шаг 3: редирект
            if (userRole === "teacher") {
                navigate("/teacher")
            } else {
                navigate("/dashboard")
            }
        } catch (e) {
            setError(e.response?.data?.message || "Ошибка при входе")
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="flex w-full flex-col gap-4">
            <input
                className="w-full h-12 rounded-xl text-[#04547E] placeholder:text-[#04547E] bg-white px-4"
                type="text"
                placeholder="Почта"
                value={login}
                onChange={e => setLogin(e.target.value)}
            />
            <input
                className="w-full h-12 rounded-xl text-[#04547E] placeholder:text-[#04547E] bg-white px-4"
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />


            <button
                onClick={handleLogin}
                className="w-full h-12 rounded-xl bg-[rgba(143,224,253,0.6)] text-[#04547E] mt-4"
                disabled={loading}
            >
                {loading ? "Вход..." : "Войти"}
            </button>
            {error && <div className="text-red-500">{error}</div>}
        </div>
    )
}

const RegistrationInterface = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [role, setRole] = useState("student") // по умолчанию "ученик"
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            setError("Пароли не совпадают")
            return
        }
        setLoading(true)
        setError("")
        try {
            const res = await axios.post("http://localhost:5000/api/auth/register", {
                username: email,
                password,
                role // передаём выбранную роль
            })
            Cookies.set("token", res.data.token, { expires: 7 })
            Cookies.set("role", role, { expires: 7 })

            // редирект по роли
            if (role === "teacher") {
                navigate("/teacher")
            } else {
                navigate("/dashboard")
            }
        } catch (e) {
            setError(e.response?.data?.message || "Ошибка при регистрации")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex w-full flex-col gap-4">
            <input
                className="w-full h-12 rounded-xl text-[#04547E] placeholder:text-[#04547E] bg-white px-4"
                type="email"
                placeholder="Почта"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <input
                className="w-full h-12 rounded-xl text-[#04547E] placeholder:text-[#04547E] bg-white px-4"
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <input
                className="w-full h-12 rounded-xl text-[#04547E] placeholder:text-[#04547E] bg-white px-4"
                type="password"
                placeholder="Повторите пароль"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
            />

            {/* Выбор роли */}
            <div className="flex gap-4 justify-around mt-2">
                <div
                    onClick={() => setRole("teacher")}
                    className={(role === "teacher" ? "bg-[rgba(143,224,253,0.60)] " : "bg-white ") +
                        "text-s transition cursor-pointer flex items-center justify-center rounded-xl font-normal w-[50%] py-2 text-[#04547E]"}
                >
                    Я преподаватель
                </div>
                <div
                    onClick={() => setRole("student")}
                    className={(role === "student" ? "bg-[rgba(143,224,253,0.60)] " : "bg-white ") +
                        "text-s transition cursor-pointer flex items-center justify-center rounded-xl font-normal w-[50%] py-2 text-[#04547E]"}
                >
                    Я ученик или студент
                </div>
            </div>

            <button
                onClick={handleRegister}
                className="w-full h-12 rounded-xl bg-[rgba(143,224,253,0.6)] text-[#04547E] mt-4"
                disabled={loading}
            >
                {loading ? "Регистрация..." : "Зарегистрироваться"}
            </button>
            {error && <div className="text-red-500">{error}</div>}
        </div>
    )
}

const AdvantagesBlock = ({ img, description, title }) => {
    return (
        <div className="flex bg-white/50 shadow-[0_2px_20px_0_rgba(0,0,0,0.10)] w-[600px] h-[270px] rounded-3xl p-12 items-center gap-16">
            <img className="w-[110px] h-[160px]" src={img} alt="icon" />
            <div className="flex flex-col  gap-2">
                <div className="w-fit rounded-3xl text-xs bg-[rgba(143,224,253,0.6)] py-2 px-6  text-[#04547E]">{description}</div>
                <div className="text-[#62ABC1] text-2xl font-black">{title}</div>
            </div>
        </div>
    )
}

const LoginPage = () => {
    const [role, setRole] = useState("login")

    return (
        <div className="flex w-full justify-around items-center flex-wrap-reverse reverse">
            <div className="flex flex-col items-center gap-4 mt-20">
                <AdvantagesBlock img={advantage_1} description="Удобный конструктор тестов" title="Создавайте викторины легко" />
                <AdvantagesBlock img={advantage_2} description="Моментальная генерация ссылок" title="Делитесь с миром своими результатами" />
                <AdvantagesBlock img={advantage_3} description="Для учителей и учеников" title="Получайте знания в интересном формате" />  
            </div>
            <div>
                <div className="text-[100px] text-white leading-30">
                    Добрый день, <br/> <span className="font-black">пользователь</span>
                </div>
                <div className="w-[660px] h-fit bg-white/50 shadow-[0_2px_20px_0_rgba(0,0,0,0.10)] rounded-3xl mt-10 flex flex-col p-16 gap-8">
                    <div className="flex gap-4 justify-around">
                        <div onClick={()=>{setRole("login")}} className={(role == "login" ? "bg-[rgba(143,224,253,0.60)] " : "bg-white ") + "text-s transition cursor-pointer flex items-center justify-center rounded-xl font-normal w-[50%]  py-2  text-[#04547E]"}>Логин</div>
                        <div onClick={()=>{setRole("registration")}} className={(role == "registration" ? "bg-[rgba(143,224,253,0.60)] " : "bg-white ") + "text-s transition cursor-pointer flex items-center justify-center rounded-xl font-normal w-[50%]  py-2  text-[#04547E]"}>Регистрация</div>   
                    </div>
                    {role == "login" && <LoginInterface />}
                    {role == "registration" && <RegistrationInterface />}
                </div>
            </div>
        </div>
    )
}

export default LoginPage
