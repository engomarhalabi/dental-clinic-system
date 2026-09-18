import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, ready } = useAuth()

  if (!ready) return null // avoid a login flash while we verify the token
  if (!isAuthenticated) return <Navigate to="/login" replace />

  return children
}
