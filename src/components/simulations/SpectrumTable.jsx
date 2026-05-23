import { useState, useMemo } from 'react'

const spectrum = [
  { wl: 656, color: '#e01010', name: 'Красный' },
  { wl: 589, color: '#ff7f00', name: 'Оранжевый' },
  { wl: 560, color: '#e8d000', name: 'Жёлтый' },
  { wl: 514, color: '#00c000', name: 'Зелёный' },
  { wl: 486, color: '#0090ff', name: 'Голубой' },
  { wl: 450, color: '#2030ff', name: 'Синий' },
  { wl: 405, color: '#8030e0', name: 'Фиолетовый' },
]

const presets = {
  water: { label: 'Вода', A: 1.324, B: 3090, C: 0 },
  crown: { label: 'Крон (стекло)', A: 1.504, B: 4430, C: 0 },
  flint: { label: 'Флинт (стекло)', A: 1.715, B: 13800, C: 0 },
  diamond: { label: 'Алмаз', A: 2.410, B: 15600, C: 0 },
}

function calcN(lambda, A, B, C) {
  const l2 = lambda * lambda
  return A + B / l2 + C / (l2 * l2)
}

export default function SpectrumTable() {
  const [A, setA] = useState(presets.water.A)
  const [B, setB] = useState(presets.water.B)
  const [C, setC] = useState(presets.water.C)
  const [preset, setPreset] = useState('water')
  const [customLambda, setCustomLambda] = useState(560)

  const data = useMemo(() =>
    spectrum.map((s) => ({
      ...s,
      n: calcN(s.wl, A, B, C),
    })),
  [A, B, C])

  const customN = useMemo(() => calcN(customLambda, A, B, C), [customLambda, A, B, C])

  const nMin = useMemo(() => Math.min(...data.map((d) => d.n)), [data])
  const nMax = useMemo(() => Math.max(...data.map((d) => d.n)), [data])

  // Generate smooth curve points
  const curvePoints = useMemo(() => {
    const pts = []
    for (let wl = 380; wl <= 780; wl += 2) {
      pts.push({ wl, n: calcN(wl, A, B, C) })
    }
    return pts
  }, [A, B, C])

  const chartW = 500, chartH = 250, padL = 55, padR = 40, padT = 20, padB = 45
  const plotW = chartW - padL - padR
  const plotH = chartH - padT - padB
  const wlMin = 370, wlMax = 790
  const nRange = Math.max(nMax - nMin, 0.001)
  const nPad = nRange * 0.3

  const toX = (wl) => padL + ((wl - wlMin) / (wlMax - wlMin)) * plotW
  const toY = (n) => padT + plotH - ((n - (nMin - nPad)) / (nMax - nMin + 2 * nPad)) * plotH

  return (
    <div>
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mb-xl">
        <div>
          <p className="text-micro-cap text-on-primary-mute mb-sm">Материал</p>
          <div className="flex flex-wrap gap-xs mb-md">
            {Object.entries(presets).map(([key, p]) => (
              <button
                type="button"
                key={key}
                onClick={() => {
                  setPreset(key)
                  setA(p.A)
                  setB(p.B)
                  setC(p.C)
                }}
                className={`px-md py-xxs rounded-pill text-xs border transition-colors ${
                  preset === key ? 'border-white text-white bg-white/10' : 'border-hairline-dark text-on-primary-mute hover:border-white/50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="flex gap-xs">
            <div>
              <label className="block text-xs text-on-primary-mute mb-xxs">A</label>
              <input
                type="number" value={A} step={0.001}
                onChange={(e) => { setA(Number(e.target.value)); setPreset('') }}
                className="w-24 bg-canvas-night border border-hairline-dark rounded-xs px-sm py-xs text-sm text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-on-primary-mute mb-xxs">B (нм²)</label>
              <input
                type="number" value={B} step={1}
                onChange={(e) => { setB(Number(e.target.value)); setPreset('') }}
                className="w-28 bg-canvas-night border border-hairline-dark rounded-xs px-sm py-xs text-sm text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-on-primary-mute mb-xxs">C (нм⁴)</label>
              <input
                type="number" value={C} step={1}
                onChange={(e) => { setC(Number(e.target.value)); setPreset('') }}
                className="w-28 bg-canvas-night border border-hairline-dark rounded-xs px-sm py-xs text-sm text-white font-mono"
              />
            </div>
          </div>
          <p className="text-xs text-on-primary-mute mt-xxs">Формула Коши: n(λ) = A + B/λ² + C/λ⁴</p>

          <div className="mt-lg">
            <label className="block text-micro-cap text-on-primary-mute mb-xxs">
              Произвольная λ: <span className="text-white font-mono">{customLambda} нм → n = {customN.toFixed(5)}</span>
            </label>
            <input
              type="range" min={380} max={780} value={customLambda}
              onChange={(e) => setCustomLambda(Number(e.target.value))}
              className="w-full accent-white"
            />
          </div>
        </div>

        {/* n(λ) chart */}
        <div>
          <p className="text-micro-cap text-on-primary-mute mb-sm">График n(λ)</p>
          <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full max-w-[500px] h-auto bg-canvas-night-soft rounded-xs">
            {/* Grid */}
            {[nMin - nPad, nMin, (nMin + nMax) / 2, nMax, nMax + nPad].map((v, idx) => (
              <g key={idx}>
                <line x1={padL} y1={toY(v)} x2={chartW - padR} y2={toY(v)}
                  stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
                <text x={padL - 6} y={toY(v) + 4} fill="rgba(255,255,255,0.35)"
                  fontSize="9" fontFamily="Inter,sans-serif" textAnchor="end">{v.toFixed(3)}</text>
              </g>
            ))}
            {[400, 500, 600, 700].map((wl) => (
              <g key={wl}>
                <line x1={toX(wl)} y1={padT} x2={toX(wl)} y2={chartH - padB}
                  stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
                <text x={toX(wl)} y={chartH - padB + 16} fill="rgba(255,255,255,0.35)"
                  fontSize="9" fontFamily="Inter,sans-serif" textAnchor="middle">{wl}</text>
              </g>
            ))}

            {/* Axes */}
            <line x1={padL} y1={chartH - padB} x2={chartW - padR} y2={chartH - padB}
              stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <line x1={padL} y1={padT} x2={padL} y2={chartH - padB}
              stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

            {/* Curve */}
            <path
              d={curvePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.wl)} ${toY(p.n)}`).join(' ')}
              fill="none" stroke="white" strokeWidth="2" opacity="0.9"
            />

            {/* Spectrum bar below curve */}
            <defs>
              <linearGradient id="spectrumGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8030e0" />
                <stop offset="16%" stopColor="#2030ff" />
                <stop offset="33%" stopColor="#0090ff" />
                <stop offset="50%" stopColor="#00c000" />
                <stop offset="66%" stopColor="#e8d000" />
                <stop offset="83%" stopColor="#ff7f00" />
                <stop offset="100%" stopColor="#e01010" />
              </linearGradient>
            </defs>
            <rect x={padL} y={chartH - padB + 20} width={plotW} height="6" rx="3" fill="url(#spectrumGrad)" opacity="0.8" />

            {/* Custom lambda marker */}
            <line x1={toX(customLambda)} y1={padT} x2={toX(customLambda)} y2={chartH - padB}
              stroke="white" strokeWidth="1" strokeDasharray="3,2" opacity="0.5" />
            <circle cx={toX(customLambda)} cy={toY(customN)} r="4" fill="white" />

            <text x={chartW / 2} y={chartH - 4} fill="rgba(255,255,255,0.3)"
              fontSize="9" fontFamily="Inter,sans-serif" textAnchor="middle">λ, нм</text>
          </svg>
        </div>
      </div>

      {/* Reference table */}
      <details className="mt-xl">
        <summary className="text-micro-cap text-on-primary-mute cursor-pointer hover:text-white transition-colors">
          Эталонная таблица (вода, 20°C) — нажмите, чтобы развернуть
        </summary>
        <div className="overflow-x-auto mt-md">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-hairline-dark">
                <th className="text-left py-sm px-md text-micro-cap text-on-primary-mute">λ, нм</th>
                <th className="text-left py-sm px-md text-micro-cap text-on-primary-mute">Цвет</th>
                <th className="text-left py-sm px-md text-micro-cap text-on-primary-mute">n (вода)</th>
                <th className="text-left py-sm px-md text-micro-cap text-on-primary-mute">n (текущий)</th>
              </tr>
            </thead>
            <tbody>
              {spectrum.map((s, i) => (
                <tr key={s.wl} className="border-b border-hairline-dark hover:bg-canvas-night-soft transition-colors">
                  <td className="py-sm px-md font-mono">{s.wl}</td>
                  <td className="py-sm px-md">
                    <span className="inline-block w-3 h-3 rounded-full mr-sm" style={{ backgroundColor: s.color }} />
                    {s.name}
                  </td>
                  <td className="py-sm px-md font-mono">{[1.3311, 1.3330, 1.3345, 1.3360, 1.3371, 1.3395, 1.3428][i].toFixed(4)}</td>
                  <td className="py-sm px-md font-mono">{data[i].n.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  )
}

export { spectrum }
