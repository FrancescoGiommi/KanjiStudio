// Traduce gli errori di Firebase Auth in messaggi chiari in italiano.
// Si basa sul codice strutturato (es. "auth/invalid-credential"), non sul testo
// del messaggio, così è robusto ai cambi di wording di Firebase.

import { FirebaseError } from 'firebase/app'

export function authErrorMessage(err: unknown): string {
  const code = err instanceof FirebaseError ? err.code : ''
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email o password errati.'
    case 'auth/email-already-in-use':
      return 'Questa email è già registrata. Prova ad accedere.'
    case 'auth/invalid-email':
      return 'Indirizzo email non valido.'
    case 'auth/missing-password':
      return 'Inserisci la password.'
    case 'auth/weak-password':
      return 'Password troppo debole: usa almeno 6 caratteri.'
    case 'auth/too-many-requests':
      return 'Troppi tentativi falliti. Riprova tra qualche minuto.'
    case 'auth/user-disabled':
      return 'Questo account è stato disabilitato.'
    case 'auth/network-request-failed':
      return 'Errore di rete. Controlla la connessione e riprova.'
    default:
      return 'Si è verificato un errore. Riprova.'
  }
}
