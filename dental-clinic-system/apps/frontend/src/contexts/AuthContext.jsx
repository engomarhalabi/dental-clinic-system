import { createContext, useContext, useEffect, useState } from 'react'
import { authApi } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('clinic_user')
      if (!raw || raw === 'undefined' || raw === 'null') return null
      return JSON.parse(raw)
    } catch (e) {
      return null
    }
  })
  const [ready, setReady] = useState(false)

  // On first load, if a token exists, confirm it's still valid and refresh
  // the cached user profile from the backend.
  useEffect(() => {
    const token = localStorage.getItem('clinic_token')
    if (!token) {
      setReady(true)
      return
    }
    authApi
      .me()
      .then((res) => {
        // ملاحظة: تأكد أيضاً مما إذا كان /auth/me يرسل البيانات داخل res.data.data أو res.data مباشرة
        const userData = res.data.data || res.data
        setUser(userData)
        localStorage.setItem('clinic_user', JSON.stringify(userData))
      })
      .catch(() => {
        localStorage.removeItem('clinic_token')
        localStorage.removeItem('clinic_user')
        setUser(null)
      })
      .finally(() => setReady(true))
  }, [])

  const login = async (email, password) => {
    const res = await authApi.login(email, password)
    // التعديل هنا لاستخراج البيانات من غلاف الـ data الذي يرسله الـ Backend
    const { token, user: loggedInUser } = res.data.data
    localStorage.setItem('clinic_token', token)
    localStorage.setItem('clinic_user', JSON.stringify(loggedInUser))
    setUser(loggedInUser)
    return loggedInUser
  }

  const logout = () => {
    localStorage.removeItem('clinic_token')
    localStorage.removeItem('clinic_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, ready, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}