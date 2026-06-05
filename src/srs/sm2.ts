// Algoritmo di ripetizione spaziata SM-2 (lo scheduler di SuperMemo 2 / Anki).
// Funzioni pure, niente Firestore qui — facili da testare e da capire.

export type Grade = 'again' | 'hard' | 'good' | 'easy'

// Stato di scheduling salvato su Firestore per ogni kanji.
export interface SrsState {
  interval: number // giorni fino al prossimo ripasso
  ease: number // fattore di facilità (>= 1.3)
  repetitions: number // ripassi corretti consecutivi
  dueDate: number // epoch ms in cui la carta torna dovuta
}

const DAY_MS = 24 * 60 * 60 * 1000

// Valore di qualità (0..5) per ogni voto, come previsto da SM-2.
const GRADE_QUALITY: Record<Grade, number> = {
  again: 1,
  hard: 3,
  good: 4,
  easy: 5,
}

export function initialState(now: number): SrsState {
  return { interval: 0, ease: 2.5, repetitions: 0, dueDate: now }
}

// Applica un voto allo stato attuale e restituisce lo stato successivo.
export function schedule(state: SrsState, grade: Grade, now: number): SrsState {
  const q = GRADE_QUALITY[grade]

  // Ricalcola il fattore di facilità (con limite minimo 1.3, come in SM-2).
  const ease = Math.max(1.3, state.ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)))

  // Una risposta sbagliata azzera la serie e rimostra la carta nella stessa sessione.
  if (q < 3) {
    return { interval: 0, ease, repetitions: 0, dueDate: now }
  }

  const repetitions = state.repetitions + 1
  let interval: number
  if (repetitions === 1) {
    interval = 1
  } else if (repetitions === 2) {
    interval = 6
  } else {
    interval = Math.round(state.interval * ease)
  }

  // "Difficile" supera comunque, ma avanza più lentamente.
  if (grade === 'hard') {
    interval = Math.max(1, Math.round(interval * 0.8))
  }

  return { interval, ease, repetitions, dueDate: now + interval * DAY_MS }
}

// Etichetta leggibile per indicare tra quanto tornerà il prossimo ripasso.
export function previewInterval(state: SrsState, grade: Grade, now: number): string {
  const next = schedule(state, grade, now)
  if (next.interval <= 0) return 'ora'
  if (next.interval === 1) return '1 giorno'
  if (next.interval < 30) return `${next.interval} giorni`
  const months = Math.round(next.interval / 30)
  return months === 1 ? '1 mese' : `${months} mesi`
}
