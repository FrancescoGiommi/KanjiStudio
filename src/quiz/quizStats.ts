// Accesso a Firestore per lo storico dei quiz e le statistiche per kanji.
//   users/{uid}/quizSessions/{autoId}  -> una riga per sessione di quiz
//   users/{uid}/kanjiStats/{character} -> contatori cumulativi per ogni kanji

import {
  addDoc,
  collection,
  doc,
  getDocs,
  increment,
  limit as fbLimit,
  orderBy,
  query,
  serverTimestamp,
  writeBatch,
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

export interface KanjiAnswer {
  character: string
  isCorrect: boolean
}

// Salva una sessione di quiz e aggiorna in modo atomico le statistiche per kanji.
export async function saveQuizResult(
  uid: string,
  summary: { mode: QuizMode; level: QuizLevel; score: number; total: number },
  answers: KanjiAnswer[],
): Promise<void> {
  // 1) Riga della sessione nello storico.
  await addDoc(collection(db, 'users', uid, 'quizSessions'), {
    ...summary,
    createdAt: serverTimestamp(),
  })

  // 2) Contatori per kanji, tutti in un'unica scrittura batch.
  const batch = writeBatch(db)
  for (const { character, isCorrect } of answers) {
    const ref = doc(db, 'users', uid, 'kanjiStats', character)
    batch.set(
      ref,
      {
        character,
        seen: increment(1),
        correct: increment(isCorrect ? 1 : 0),
        lastSeen: serverTimestamp(),
      },
      { merge: true },
    )
  }
  await batch.commit()
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
