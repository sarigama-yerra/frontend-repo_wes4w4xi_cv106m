import { useEffect, useState } from 'react'

const COUNTRIES = [
  { code: 'NL', name: 'Nederland' },
  { code: 'AE', name: 'Dubai' },
  { code: 'BH', name: 'Bahrein' },
]

function useCountry() {
  const [country, setCountry] = useState(() => localStorage.getItem('country') || 'NL')
  useEffect(() => {
    localStorage.setItem('country', country)
  }, [country])
  return { country, setCountry }
}

export default function Landing() {
  const { country, setCountry } = useCountry()
  const [banners, setBanners] = useState([])
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
    fetch(`${baseUrl}/api/banners?country=${country}`)
      .then(r => r.json())
      .then(setBanners)
      .catch(() => setBanners([]))
  }, [country])

  useEffect(() => {
    const target = new Date()
    target.setMonth(target.getMonth() + 1)
    const timer = setInterval(() => {
      const now = new Date()
      const diff = target - now
      if (diff <= 0) return setTimeLeft('00:00:00')
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const m = Math.floor((diff / (1000 * 60)) % 60)
      const s = Math.floor((diff / 1000) % 60)
      setTimeLeft(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.15),transparent_40%)]" />
      <div className="relative max-w-6xl mx-auto px-6 py-16">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">BirthdayDeals</h1>
            <p className="text-blue-200/80 mt-2">Vier je verjaardag met exclusieve deals. Beschikbaar in NL, AE en BH.</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-blue-200/80">Land</label>
            <select value={country} onChange={e=>setCountry(e.target.value)} className="bg-slate-800/60 border border-blue-500/30 rounded-lg px-3 py-2">
              {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
            </select>
          </div>
        </header>

        <section className="grid sm:grid-cols-2 gap-6 items-stretch mb-12">
          <div className="rounded-2xl border border-blue-500/20 bg-slate-800/40 p-6 backdrop-blur">
            <h2 className="text-2xl font-semibold mb-2">Lancering over</h2>
            <p className="text-6xl font-bold text-blue-300 drop-shadow">{timeLeft}</p>
            <p className="text-blue-200/70 mt-3">We tellen af naar iets groots. Meld je aan en blijf op de hoogte.</p>
            <div className="mt-6 flex gap-3">
              <a href="#" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition">Ik ben een gebruiker</a>
              <a href="#" className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition">Ik ben een bedrijf</a>
            </div>
          </div>
          <div className="rounded-2xl border border-blue-500/20 bg-slate-800/40 p-6 backdrop-blur">
            <h2 className="text-2xl font-semibold mb-4">Banners</h2>
            <div className="grid grid-cols-1 gap-4">
              {banners.length === 0 && (
                <div className="text-blue-200/70">Geen banners voor dit land.</div>
              )}
              {banners.map(b => (
                <a key={b.id} href={b.link_url || '#'} className="group block rounded-xl overflow-hidden border border-blue-500/20 hover:border-blue-400/40 transition">
                  <div className="p-4">
                    <p className="text-sm text-blue-200/70">{b.title}</p>
                    <img src={b.image_url} alt={b.title} className="mt-2 w-full h-32 object-cover rounded-lg group-hover:scale-[1.01] transition" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
