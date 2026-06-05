// Livello di accesso a Firestore per il sistema di ripasso a ripetizione spaziata.
// Le review stanno in una sottocollezione per utente, così scalano e si possono
// interrogare per data di scadenza:
//   users/{uid}/reviews/{character}

import {
  collection,
  doc,
  deleteDoc,
  getDocs,
  query,
  setDoc,
  where,
  orderBy,
  limit as fbLimit,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../firebase/firebase'
import { initialState, schedule, type Grade, type SrsState } from './sm2'

export interface ReviewCard extends SrsState {
  character: string
  jlpt: 1 | 2 | 3 | 4 | 5
}

interface ReviewDoc {
  character: string
  jlpt: number
  interval: number
  ease: number
  repetitions: number
  dueDate: Timestamp
}

function reviewsCol(uid: string) {
  return collection(db, 'users', uid, 'reviews')
}

function toCard(data: ReviewDoc): ReviewCard {
  return {
    character: data.character,
    jlpt: data.jlpt as 1 | 2 | 3 | 4 | 5,
    interval: data.interval,
    ease: data.ease,
    repetitions: data.repetitions,
    dueDate: data.dueDate.toMillis(),
  }
}

// Crea una entry di ripasso per un kanji appena imparato (dovuto subito).
export async function createReview(
  uid: string,
  character: string,
  jlpt: 1 | 2 | 3 | 4 | 5,
  now: number,
): Promise<void> {
  const state = initialState(now)
  await setDoc(doc(reviewsCol(uid), character), {
    character,
    jlpt,
    interval: state.interval,
    ease: state.ease,
    repetitions: state.repetitions,
    dueDate: Timestamp.fromMillis(state.dueDate),
  } satisfies ReviewDoc)
}

export async function deleteReview(uid: string, character: string): Promise<void> {
  await deleteDoc(doc(reviewsCol(uid), character))
}

// Recupera le carte dovute ora, dalla più vecchia.
export async function getDueReviews(uid: string, now: number, max = 50): Promise<ReviewCard[]> {
  const q = query(
    reviewsCol(uid),
    where('dueDate', '<=', Timestamp.fromMillis(now)),
    orderBy('dueDate', 'asc'),
    fbLimit(max),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => toCard(d.data() as ReviewDoc))
}

// Quante carte sono dovute in questo momento (per il badge della dashboard).
export async function countDueReviews(uid: string, now: number): Promise<number> {
  const q = query(reviewsCol(uid), where('dueDate', '<=', Timestamp.fromMillis(now)))
  const snap = await getDocs(q)
  return snap.size
}

// Applica un voto a una carta e salva il nuovo scheduling.
export async function gradeReview(
  uid: string,
  card: ReviewCard,
  grade: Grade,
  now: number,
): Promise<ReviewCard> {
  const next = schedule(card, grade, now)
  await setDoc(doc(reviewsCol(uid), card.character), {
    character: card.character,
    jlpt: card.jlpt,
    interval: next.interval,
    ease: next.ease,
    repetitions: next.repetitions,
    dueDate: Timestamp.fromMillis(next.dueDate),
  } satisfies ReviewDoc)
  return { ...card, ...next }
}
