import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { authErrorMessage } from '../utils/authErrors'

interface AuthModalProps {
  onClose: () => void
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const { loginWithEmail, registerWithEmail, resetPassword } = useAuth()
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  const switchMode = (next: 'login' | 'register' | 'reset') => {
    setMode(next)
    setError('')
    setInfo('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setInfo('')

    // Validazione client-side: feedback immediato senza chiamata di rete.
    if (mode === 'register' && password.length < 6) {
      setError('La password deve avere almeno 6 caratteri.')
      return
    }

    setLoading(true)
    try {
      if (mode === 'login') {
        await loginWithEmail(email, password)
        onClose()
      } else if (mode === 'register') {
        await registerWithEmail(email, password)
        onClose()
      } else {
        await resetPassword(email)
        setInfo('Ti abbiamo inviato un’email per reimpostare la password. Controlla la posta (anche lo spam).')
      }
    } catch (err: unknown) {
      setError(authErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: 40 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
      >
        <div className="bg-[#1a1a2e] border border-white/10 rounded-3xl shadow-2xl p-8 w-full max-w-sm pointer-events-auto relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>

          <h2 className="text-2xl font-extrabold mb-1">
            {mode === 'login' ? 'Bentornato!' : mode === 'register' ? 'Crea account' : 'Reimposta password'}
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            {mode === 'login'
              ? 'Accedi per continuare a studiare.'
              : mode === 'register'
                ? 'Inizia il tuo percorso JLPT.'
                : 'Inserisci la tua email: ti invieremo un link per reimpostarla.'}
          </p>


          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            {mode !== 'reset' && (
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            )}

            {mode === 'login' && (
              <button
                type="button"
                onClick={() => switchMode('reset')}
                className="self-end text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
              >
                Password dimenticata?
              </button>
            )}

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl bg-red-500/10 border border-red-500/30 px-3 py-2 text-red-300 text-sm"
              >
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {info && (
              <div
                role="status"
                className="flex items-start gap-2 rounded-xl bg-green-500/10 border border-green-500/30 px-3 py-2 text-green-300 text-sm"
              >
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                <span>{info}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-bold transition-all disabled:opacity-50"
            >
              {loading
                ? 'Caricamento…'
                : mode === 'login'
                  ? 'Accedi'
                  : mode === 'register'
                    ? 'Registrati'
                    : 'Invia link di reset'}
            </button>
          </form>

          {mode === 'reset' ? (
            <p className="text-center text-sm text-slate-400 mt-4">
              <button
                onClick={() => switchMode('login')}
                className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
              >
                ← Torna al login
              </button>
            </p>
          ) : (
            <p className="text-center text-sm text-slate-400 mt-4">
              {mode === 'login' ? 'Non hai un account?' : 'Hai già un account?'}{' '}
              <button
                onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
              >
                {mode === 'login' ? 'Registrati' : 'Accedi'}
              </button>
            </p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
