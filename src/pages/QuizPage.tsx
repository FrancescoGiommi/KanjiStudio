import { ArrowLeft, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function QuizPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      <nav className="flex items-center gap-4 px-6 py-4 max-w-6xl mx-auto border-b border-white/10">
        <button
          onClick={() => navigate('/')}
          className="text-slate-400 hover:text-white transition-colors"
          aria-label="Torna alla dashboard"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          KanjiStudio
        </span>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <section className="rounded-2xl bg-white/5 border border-white/10 p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <Zap size={24} />
            </div>
            <div>
              <p className="text-sm text-orange-300 font-semibold">Quiz veloce</p>
              <h1 className="text-3xl font-extrabold">10 domande random</h1>
            </div>
          </div>

          <p className="text-slate-400 leading-relaxed">
            Qui costruiremo il quiz con scelta livello, risposte multiple e risultato finale.
            La pagina e la rotta sono pronte: ora possiamo aggiungere la logica senza toccare
            di nuovo la navigazione.
          </p>
        </section>
      </main>
    </div>
  )
}
