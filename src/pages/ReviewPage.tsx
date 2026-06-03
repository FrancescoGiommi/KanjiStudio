import { ArrowLeft, RotateCcw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function ReviewPage() {
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
              <RotateCcw size={24} />
            </div>
            <div>
              <p className="text-sm text-green-300 font-semibold">Ripasso</p>
              <h1 className="text-3xl font-extrabold">Kanji da ripassare</h1>
            </div>
          </div>

          <p className="text-slate-400 leading-relaxed">
            Qui costruiremo il ripasso con flashcard e stato dei kanji imparati. Per ora la
            pagina è pronta e collegata, così il prossimo step può concentrarsi sulla logica.
          </p>
        </section>
      </main>
    </div>
  )
}
