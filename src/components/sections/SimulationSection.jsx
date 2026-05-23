import { Badge } from '@/components/ui/badge'

const spectrumColors = [
  { stop: '0%', color: '#ff0000' },
  { stop: '16%', color: '#ff7f00' },
  { stop: '33%', color: '#ffff00' },
  { stop: '50%', color: '#00ff00' },
  { stop: '66%', color: '#0000ff' },
  { stop: '83%', color: '#4b0082' },
  { stop: '100%', color: '#8b00ff' },
]

export default function SimulationSection() {
  return (
    <section id="simulation" className="bg-canvas-night py-[120px] px-xxl text-center">
      <div className="max-w-[1200px] mx-auto">
        <Badge className="mb-md">Моделирование</Badge>
        <h2 className="display-lg mb-md">Разложение в призме</h2>
        <p className="text-base leading-[1.7] tracking-[0.32px] text-on-primary-mute max-w-[640px] mx-auto mb-huge">
          В качестве материала выбран стеклянный клин треугольного сечения. Белый луч, проходя через призму, испытывает двойное преломление на гранях — дисперсия разделяет его на монохроматические составляющие.
        </p>

        {/* Prism SVG diagram */}
        <div className="relative w-full max-w-[800px] mx-auto mb-huge h-[300px]">
          <svg viewBox="0 0 800 300" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            <line x1="80" y1="155" x2="280" y2="155" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
            <polygon points="280,80 400,240 280,240" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            {[
              { y: 80, color: '#ff0000' },
              { y: 90, color: '#ff7f00' },
              { y: 100, color: '#ffff00' },
              { y: 110, color: '#00ff00' },
              { y: 120, color: '#0000ff' },
              { y: 130, color: '#4b0082' },
              { y: 140, color: '#8b00ff' },
            ].map((ray) => (
              <line key={ray.color} x1="340" y1="160" x2="700" y2={ray.y} stroke={ray.color} strokeWidth="1.5" opacity="0.6" />
            ))}
            <rect x="700" y="70" width="12" height="80" rx="2" fill="url(#spectrumGrad)" opacity="0.8" />
            <defs>
              <linearGradient id="spectrumGrad" x1="0" y1="0" x2="0" y2="1">
                {spectrumColors.map(({ stop, color }) => (
                  <stop key={stop} offset={stop} stopColor={color} />
                ))}
              </linearGradient>
            </defs>
          </svg>
        </div>

        <a href="#simulations" className="inline-flex items-center justify-center px-xl py-lg border border-white rounded-pill text-button-cap uppercase tracking-[1.17px] font-bold text-white bg-transparent hover:bg-white hover:text-black transition-colors">
          Запустить симуляцию
        </a>
      </div>
    </section>
  )
}
