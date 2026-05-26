import './App.css'
import React, { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import jwtDecode from 'jwt-decode'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'

function decodeToken(token) {
  try {
    return jwtDecode(token)
  } catch {
    return null
  }
}

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [usuario, setUsuario] = useState(() => {
    const t = localStorage.getItem('token')
    return t ? decodeToken(t) : null
  })
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      setUsuario(decodeToken(token))
    } else {
      localStorage.removeItem('token')
      setUsuario(null)
    }
  }, [token])

  const handleLogin = (t) => {
    setToken(t)
    navigate('/dashboard')
  }

  const handleLogout = () => {
    setToken(null)
    navigate('/login')
  }

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route
        path="/register"
        element={
          <ProtectedRoute usuario={usuario} allowedRoles={["GERENTE"]}>
            <Register />
          </ProtectedRoute>
        }
      />
      <Route path="/dashboard" element={<Dashboard usuario={usuario} onLogout={handleLogout} />} />
      <Route path="*" element={<Login onLogin={handleLogin} />} />
    </Routes>
  )
}

export default App
