import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User as FirebaseUser,
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase/firebase'
import { createReview, deleteReview } from '../srs/reviews'

interface AuthContextType {
  user: FirebaseUser | null
  loading: boolean
  learnedKanji: Set<string>
  loginWithEmail: (email: string, password: string) => Promise<void>
  registerWithEmail: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  toggleLearned: (character: string, jlpt: 1 | 2 | 3 | 4 | 5) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

async function createUserProfileIfMissing(user: FirebaseUser) {
  const ref = doc(db, 'users', user.uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName ?? user.email?.split('@')[0] ?? 'Utente',
      createdAt: serverTimestamp(),
      streak: 0,
      lastStudyDate: null,
      progress: {
        N5: { learned: [], total: 103 },
        N4: { learned: [], total: 181 },
        N3: { learned: [], total: 361 },
        N2: { learned: [], total: 367 },
        N1: { learned: [], total: 1232 },
      },
    })
  }
}

async function loadLearnedKanji(uid: string): Promise<Set<string>> {
  const snap = await getDoc(doc(db, 'users', uid))
  if (!snap.exists()) return new Set()
  const data = snap.data()
  const all: string[] = []
  for (const level of ['N1', 'N2', 'N3', 'N4', 'N5']) {
    const arr: string[] = data?.progress?.[level]?.learned ?? []
    all.push(...arr)
  }
  return new Set(all)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [learnedKanji, setLearnedKanji] = useState<Set<string>>(new Set())

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        await createUserProfileIfMissing(firebaseUser)
        const learned = await loadLearnedKanji(firebaseUser.uid)
        setLearnedKanji(learned)
      } else {
        setLearnedKanji(new Set())
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const loginWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const registerWithEmail = async (email: string, password: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    await createUserProfileIfMissing(user)
  }

  const logout = async () => {
    await signOut(auth)
  }

  const toggleLearned = async (character: string, jlpt: 1 | 2 | 3 | 4 | 5) => {
    if (!user) return
    const ref = doc(db, 'users', user.uid)
    const field = `progress.N${jlpt}.learned`
    if (learnedKanji.has(character)) {
      await updateDoc(ref, { [field]: arrayRemove(character) })
      await deleteReview(user.uid, character)
      setLearnedKanji((prev) => { const next = new Set(prev); next.delete(character); return next })
    } else {
      await updateDoc(ref, { [field]: arrayUnion(character) })
      await createReview(user.uid, character, jlpt, Date.now())
      setLearnedKanji((prev) => new Set([...prev, character]))
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, learnedKanji, loginWithEmail, registerWithEmail, logout, toggleLearned }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
