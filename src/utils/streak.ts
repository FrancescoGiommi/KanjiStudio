// Logica dello streak di studio (giorni consecutivi). Funzioni pure: la data del
// giorno viene passata come argomento, così sono testabili e indipendenti dal fuso.

// Chiave del giorno in formato YYYY-MM-DD basata sull'ora locale.
export function todayKey(now: Date): string {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Differenza in giorni interi tra due chiavi YYYY-MM-DD (toKey - fromKey).
export function dayDiff(fromKey: string, toKey: string): number {
  const [y1, m1, d1] = fromKey.split('-').map(Number)
  const [y2, m2, d2] = toKey.split('-').map(Number)
  const a = Date.UTC(y1, m1 - 1, d1)
  const b = Date.UTC(y2, m2 - 1, d2)
  return Math.round((b - a) / 86_400_000)
}

// Nuovo valore dello streak quando si registra un'attività "oggi".
// - stesso giorno: invariato (già contato)
// - giorno successivo: +1
// - salto o primo studio: riparte da 1
export function nextStreak(streak: number, lastStudyDate: string | null, today: string): number {
  if (lastStudyDate === today) return streak
  if (lastStudyDate && dayDiff(lastStudyDate, today) === 1) return streak + 1
  return 1
}

// Streak da mostrare: resta valido se l'ultimo studio è oggi o ieri,
// altrimenti è considerato interrotto (0).
export function displayStreak(streak: number, lastStudyDate: string | null, today: string): number {
  if (!lastStudyDate) return 0
  return dayDiff(lastStudyDate, today) <= 1 ? streak : 0
}
