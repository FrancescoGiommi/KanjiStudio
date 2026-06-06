import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// Protegge le rotte riservate: se l'utente non è autenticato lo rimanda alla home,
// dove HomePage mostra la landing con il login. Lo stato di caricamento dell'auth
// è già gestito a monte dall'AuthProvider, quindi qui basta controllare `user`.
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/" replace />
  return <>{children}</>
}
