import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  type User as FirebaseUser,
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase/firebase'
import { createReview, deleteReview } from '../srs/reviews'
import { LEVEL_COUNTS } from '../data/kanjiData'
import { displayStreak, nextStreak, todayKey } from '../utils/streak'

interface AuthContextType {
  user: FirebaseUser | null
  loading: boolean
  learnedKanji: Set<string>
  streak: number
  loginWithEmail: (email: string, password: string) => Promise<void>
  registerWithEmail: (email: string, password: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  logout: () => Promise<void>
  toggleLearned: (character: string, jlpt: 1 | 2 | 3 | 4 | 5) => Promise<void>
  recordStudyActivity: () => Promise<void>
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
        N5: { learned: [], total: LEVEL_COUNTS[5] },
        N4: { learned: [], total: LEVEL_COUNTS[4] },
        N3: { learned: [], total: LEVEL_COUNTS[3] },
        N2: { learned: [], total: LEVEL_COUNTS[2] },
        N1: { learned: [], total: LEVEL_COUNTS[1] },
      },
    })
  }
}

interface LoadedProfile {
  learned: Set<string>
  streak: number
  lastStudyDate: string | null
}

async function loadProfile(uid: string): Promise<LoadedProfile> {
  const snap = await getDoc(doc(db, 'users', uid))
  if (!snap.exists()) return { learned: new Set(), streak: 0, lastStudyDate: null }
  const data = snap.data()
  const all: string[] = []
  for (const level of ['N1', 'N2', 'N3', 'N4', 'N5']) {
    const arr: string[] = data?.progress?.[level]?.learned ?? []
    all.push(...arr)
  }
  return {
    learned: new Set(all),
    streak: data?.streak ?? 0,
    lastStudyDate: data?.lastStudyDate ?? null,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [learnedKanji, setLearnedKanji] = useState<Set<string>>(new Set())
  const [streak, setStreak] = useState(0)
  const [lastStudyDate, setLastStudyDate] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        await createUserProfileIfMissing(firebaseUser)
        const profile = await loadProfile(firebaseUser.uid)
        setLearnedKanji(profile.learned)
        setStreak(profile.streak)
        setLastStudyDate(profile.lastStudyDate)
      } else {
        setLearnedKanji(new Set())
        setStreak(0)
        setLastStudyDate(null)
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

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email)
  }

  const logout = async () => {
    await signOut(auth)
  }

  // Registra un'attività di studio per oggi e aggiorna lo streak su Firestore.
  // Idempotente nello stesso giorno: più attività in una giornata contano una volta.
  const recordStudyActivity = async () => {
    if (!user) return
    const today = todayKey(new Date())
    if (lastStudyDate === today) return
    const updated = nextStreak(streak, lastStudyDate, today)
    await updateDoc(doc(db, 'users', user.uid), { streak: updated, lastStudyDate: today })
    setStreak(updated)
    setLastStudyDate(today)
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
      await recordStudyActivity()
    }
  }

  const currentStreak = displayStreak(streak, lastStudyDate, todayKey(new Date()))

  return (
    <AuthContext.Provider value={{ user, loading, learnedKanji, streak: currentStreak, loginWithEmail, registerWithEmail, resetPassword, logout, toggleLearned, recordStudyActivity }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
