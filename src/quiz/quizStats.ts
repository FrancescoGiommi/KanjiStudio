// Accesso a Firestore per lo storico dei quiz.
//   users/{uid}/quizSessions/{autoId} -> una riga per sessione di quiz

import {
  addDoc,
  collection,
  getDocs,
  limit as fbLimit,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../firebase/firebase'

export type QuizLevel = 'all' | 1 | 2 | 3 | 4 | 5
export type QuizMode = 'meaning' | 'kanji'

export interface QuizSession {
  id: string
  mode: QuizMode
  level: QuizLevel
  score: number
  total: number
  createdAt: number | null // epoch ms (null finché il server non ha scritto il timestamp)
}

// Salva una sessione di quiz nello storico.
export async function saveQuizResult(
  uid: string,
  summary: { mode: QuizMode; level: QuizLevel; score: number; total: number },
): Promise<void> {
  await addDoc(collection(db, 'users', uid, 'quizSessions'), {
    ...summary,
    createdAt: serverTimestamp(),
  })
}

// Ultime sessioni di quiz, dalla più recente.
export async function getRecentQuizzes(uid: string, max = 5): Promise<QuizSession[]> {
  const q = query(
    collection(db, 'users', uid, 'quizSessions'),
    orderBy('createdAt', 'desc'),
    fbLimit(max),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => {
    const data = d.data()
    const createdAt = data.createdAt as Timestamp | null
    return {
      id: d.id,
      mode: data.mode,
      level: data.level,
      score: data.score,
      total: data.total,
      createdAt: createdAt ? createdAt.toMillis() : null,
    }
  })
}
