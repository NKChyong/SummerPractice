import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Cookies from "js-cookie"
import LoginPage from "./pages/login"
import TeacherPage from "./pages/teacher"
import StudentPage from "./pages/student"
import DashboardPage from "./pages/dashboard"

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = Cookies.get("token")
  const role = Cookies.get("role")

  console.log("TOKEN:", token)
  console.log("ROLE:", role)

  if (!token) {
    return <Navigate to="/" replace />
  }

  if (!allowedRoles.includes(role)) {
    // если роль не разрешена — редиректим на свою панель
    if (role === "teacher") return <Navigate to="/teacher" replace />
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function App() {
  return (
    <div className="flex justify-center items-center">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />

          <Route path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <DashboardPage />
              </ProtectedRoute>
          }/>

          <Route
            path="/teacher"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <TeacherPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/test/:url"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentPage />
              </ProtectedRoute>
            }
          />

          <Route path="/*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
