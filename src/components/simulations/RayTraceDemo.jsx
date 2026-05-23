import { useState, useMemo } from 'react'
import { spectrum } from './SpectrumTable'
import RayTrace3D from './RayTrace3D'

const cauchyWater = { A: 1.324, B: 3090, C: 0 }

function calcN(lambda, coeffs) {
  const l2 = lambda * lambda
  return coeffs.A + coeffs.B / l2 + coeffs.C / (l2 * l2)
}

function polarToCart(cx, cy, r, angleRad) {
  return { x: cx + r * Math.cos(angleRad), y: cy - r * Math.sin(angleRad) }
}

export default function RayTraceDemo() {
  const [lambda, setLambda] = useState(560)
  const [impactH, setImpactH] = useState(0.75)
  const [cauchyA, setCauchyA] = useState(cauchyWater.A)
  const [cauchyB, setCauchyB] = useState(cauchyWater.B)
  const [cauchyC, setCauchyC] = useState(cauchyWater.C)
  const [activeTab, setActiveTab] = useState('sim')

  const n = useMemo(() => calcN(lambda, { A: cauchyA, B: cauchyB, C: cauchyC }), [lambda, cauchyA, cauchyB, cauchyC])

  const color = useMemo(() => {
    const hue = ((780 - lambda) / (780 - 380)) * 270
    return `hsl(${Math.max(0, Math.min(270, hue))}, 90%, 55%)`
  }, [lambda])

  const R = 150
  const hPx = impactH * R
  const i = Math.asin(Math.min(hPx / R, 0.999))
  const r = Math.asin(Math.sin(i) / n)
  const D = 180 + 2 * (i * 180 / Math.PI) - 4 * (r * 180 / Math.PI)
  const rainbowAngle = 180 - D

  const entry = polarToCart(250, 200, R, Math.PI / 2 + i)
  const back = polarToCart(250, 200, R, Math.PI / 2 - i + 2 * r)
  const exitP = polarToCart(250, 200, R, Math.PI / 2 - i + 4 * r)
  const exitDir = Math.PI / 2 - i + 4 * r

  const descartesH = useMemo(() => {
    const val = (n * n - 1) / 3
    if (val <= 0 || val >= 1) return 0.86
    const cosI = Math.sqrt(val)
    return Math.sqrt(1 - cosI * cosI)
  }, [n])

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-xl border-b border-hairline-dark">
        {[
          ['sim', '2D-модель'],
          ['3d', '3D-вид'],
          ['table', 'Таблица'],
        ].map(([id, label]) => (
          <button
            type="button"
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-lg py-sm text-button-cap uppercase transition-colors ${
              activeTab === id
                ? 'border-b-2 border-white text-white'
                : 'text-on-primary-mute hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-xl p-lg bg-canvas-night-soft rounded-xs">
        <div>
          <label className="block text-micro-cap text-on-primary-mute mb-xxs">
            Длина волны λ: <span className="text-white font-mono">{lambda} нм</span>
          </label>
          <input
            type="range" min={380} max={780} value={lambda}
            onChange={(e) => setLambda(Number(e.target.value))}
            className="w-full accent-white"
          />
          <div className="flex justify-between text-xs text-on-primary-mute">
            <span>380</span><span>780 нм</span>
          </div>
        </div>
        <div>
          <label className="block text-micro-cap text-on-primary-mute mb-xxs">
            Прицельный параметр h/R: <span className="text-white font-mono">{impactH.toFixed(3)}</span>
          </label>
          <input
            type="range" min={0.01} max={0.99} step={0.005} value={impactH}
            onChange={(e) => setImpactH(Number(e.target.value))}
            className="w-full accent-white"
          />
          <div className="flex justify-between text-xs text-on-primary-mute">
            <span>0</span>
            <span className={Math.abs(impactH - descartesH) < 0.02 ? 'text-white font-bold' : ''}>
              Декарт: {descartesH.toFixed(3)}
            </span>
            <span>0.99</span>
          </div>
        </div>
        <div>
          <label className="block text-micro-cap text-on-primary-mute mb-xxs">
            Коэффициенты Коши: A, B, C
          </label>
          <div className="flex gap-xs">
            <input
              type="number" value={cauchyA} step={0.001}
              onChange={(e) => setCauchyA(Number(e.target.value))}
              className="w-full bg-canvas-night border border-hairline-dark rounded-xs px-sm py-xs text-sm text-white font-mono"
              placeholder="A"
            />
            <input
              type="number" value={cauchyB} step={1}
              onChange={(e) => setCauchyB(Number(e.target.value))}
              className="w-full bg-canvas-night border border-hairline-dark rounded-xs px-sm py-xs text-sm text-white font-mono"
              placeholder="B"
            />
            <input
              type="number" value={cauchyC} step={1}
              onChange={(e) => setCauchyC(Number(e.target.value))}
              className="w-full bg-canvas-night border border-hairline-dark rounded-xs px-sm py-xs text-sm text-white font-mono"
              placeholder="C"
            />
          </div>
          <p className="text-xs text-on-primary-mute mt-xxs">n(λ) = A + B/λ² + C/λ⁴</p>
        </div>
      </div>

      {/* Preset buttons */}
      <div className="flex flex-wrap gap-xs mb-xl">
        {spectrum.map((s) => (
          <button
            type="button"
            key={s.wl}
            onClick={() => setLambda(s.wl)}
            className={`px-md py-xxs rounded-pill text-xs border transition-colors ${
              lambda === s.wl
                ? 'border-white text-white bg-white/10'
                : 'border-hairline-dark text-on-primary-mute hover:border-white/50'
            }`}
          >
            <span className="inline-block w-2 h-2 rounded-full mr-xs" style={{ backgroundColor: s.color }} />
            {s.name}
          </button>
        ))}
        <button
          type="button"
          onClick={() => { setCauchyA(1.324); setCauchyB(3090); setCauchyC(0) }}
          className="px-md py-xxs rounded-pill text-xs border border-hairline-dark text-on-primary-mute hover:border-white/50 transition-colors"
        >
          ↺ Вода
        </button>
      </div>

      {/* Content */}
      {activeTab === 'sim' && (
        <div className="space-y-md">
          <div className="flex flex-wrap gap-lg text-sm font-mono text-on-primary-mute p-md bg-canvas-night-soft rounded-xs">
            <span>n({lambda}нм) = <span className="text-white">{n.toFixed(4)}</span></span>
            <span>i = <span className="text-white">{((i * 180) / Math.PI).toFixed(1)}°</span></span>
            <span>r = <span className="text-white">{((r * 180) / Math.PI).toFixed(1)}°</span></span>
            <span>D = <span className="text-white">{D.toFixed(1)}°</span></span>
            <span>θ<sub>радуги</sub> = <span className="text-white">{rainbowAngle.toFixed(1)}°</span></span>
            {Math.abs(impactH - descartesH) < 0.02 && (
              <span className="text-white font-bold">← Декартов луч!</span>
            )}
          </div>

          <svg viewBox="0 0 500 400" className="w-full max-w-[500px] mx-auto h-auto block">
            <defs>
              <radialGradient id="dropGrad2" cx="40%" cy="35%">
                <stop offset="0%" stopColor="rgba(120,180,255,0.22)" />
                <stop offset="100%" stopColor="rgba(30,60,120,0.06)" />
              </radialGradient>
            </defs>
            <line x1="30" y1={entry.y} x2={entry.x} y2={entry.y}
              stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeDasharray="6,3" />
            <line x1="30" y1={entry.y} x2="55" y2={entry.y}
              stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <circle cx={250} cy={200} r={R} fill="url(#dropGrad2)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
            <line x1="245" y1="200" x2="245" y2={entry.y}
              stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" strokeDasharray="2,4" />
            <text x="240" y={200 - (200 - entry.y) / 2} fill="rgba(255,255,255,0.35)"
              fontSize="9" fontFamily="Inter,sans-serif" textAnchor="end">h</text>
            <line x1={entry.x} y1={entry.y} x2={back.x} y2={back.y} stroke={color} strokeWidth="2" opacity="0.8" />
            <line x1={back.x} y1={back.y} x2={exitP.x} y2={exitP.y} stroke={color} strokeWidth="2" opacity="0.8" />
            {(() => {
              const len = 200
              const ex = exitP.x + len * Math.sin(exitDir)
              const ey = exitP.y - len * Math.cos(exitDir)
              return (
                <line x1={exitP.x} y1={exitP.y} x2={ex} y2={ey} stroke={color} strokeWidth="1.5" opacity="0.7" />
              )
            })()}
            <line x1={250} y1={200} x2={entry.x} y2={entry.y}
              stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" strokeDasharray="3,3" />
            <line x1={250} y1={200} x2={exitP.x} y2={exitP.y}
              stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" strokeDasharray="3,3" />
            <circle cx={entry.x} cy={entry.y} r="4" fill="white" opacity="0.9" />
            <circle cx={back.x} cy={back.y} r="3" fill={color} opacity="0.7" />
            <circle cx={exitP.x} cy={exitP.y} r="3" fill={color} opacity="0.7" />
            <text x={entry.x + 10} y={entry.y - 8} fill="rgba(255,255,255,0.7)" fontSize="11" fontFamily="Inter,sans-serif">Вход</text>
            <text x={back.x - 50} y={back.y + 5} fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="Inter,sans-serif">Отражение</text>
            <text x={exitP.x + 10} y={exitP.y - 8} fill="rgba(255,255,255,0.7)" fontSize="11" fontFamily="Inter,sans-serif">Выход</text>
            <text x="310" y="30" fill="rgba(255,255,255,0.45)" fontSize="11" fontFamily="Inter,sans-serif">
              θ = {rainbowAngle.toFixed(1)}°
            </text>
            <text x="35" y="25" fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="Inter,sans-serif">Солнечный луч →</text>
          </svg>
          <p className="text-xs text-on-primary-mute text-center leading-relaxed">
            Подвиньте h/R к отметке Декарта ({descartesH.toFixed(3)}) — отклонение минимально.
          </p>
        </div>
      )}

      {activeTab === '3d' && (
        <div>
          <RayTrace3D impactParam={impactH} n={n} dropR={0.9} color={color} />
          <p className="text-xs text-on-primary-mute text-center mt-sm leading-relaxed">
            Вращайте каплю мышью. Цвет луча соответствует выбранной длине волны.
          </p>
        </div>
      )}

      {activeTab === 'table' && (
        <div className="overflow-x-auto">
          <p className="text-micro-cap text-on-primary-mute mb-md">Эталонные значения (вода, 20°C) — кликните по строке, чтобы загрузить в симуляцию</p>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-hairline-dark">
                <th className="text-left py-sm px-md text-micro-cap text-on-primary-mute">λ, нм</th>
                <th className="text-left py-sm px-md text-micro-cap text-on-primary-mute">Цвет</th>
                <th className="text-left py-sm px-md text-micro-cap text-on-primary-mute">n</th>
                <th className="text-left py-sm px-md text-micro-cap text-on-primary-mute">i₀</th>
                <th className="text-left py-sm px-md text-micro-cap text-on-primary-mute">r₀</th>
                <th className="text-left py-sm px-md text-micro-cap text-on-primary-mute">θ₁, °</th>
              </tr>
            </thead>
            <tbody>
              {spectrum.map((s) => {
                const ni = [1.3311, 1.3330, 1.3345, 1.3360, 1.3371, 1.3395, 1.3428][spectrum.indexOf(s)]
                const val = (ni * ni - 1) / 3
                if (val <= 0 || val >= 1) return null
                const cosI = Math.sqrt(val)
                const inc = Math.acos(cosI)
                const refr = Math.asin(Math.sin(inc) / ni)
                const dev = 180 + 2 * (inc * 180 / Math.PI) - 4 * (refr * 180 / Math.PI)
                const theta = 180 - dev
                return (
                  <tr key={s.wl} className="border-b border-hairline-dark hover:bg-canvas-night-soft transition-colors cursor-pointer"
                    onClick={() => { setLambda(s.wl); setActiveTab('sim') }}>
                    <td className="py-sm px-md font-mono">{s.wl}</td>
                    <td className="py-sm px-md">
                      <span className="inline-block w-3 h-3 rounded-full mr-sm" style={{ backgroundColor: s.color }} />
                      {s.name}
                    </td>
                    <td className="py-sm px-md font-mono">{ni.toFixed(4)}</td>
                    <td className="py-sm px-md font-mono">{(inc * 180 / Math.PI).toFixed(1)}°</td>
                    <td className="py-sm px-md font-mono">{(refr * 180 / Math.PI).toFixed(1)}°</td>
                    <td className="py-sm px-md font-mono font-bold">{theta.toFixed(1)}°</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
