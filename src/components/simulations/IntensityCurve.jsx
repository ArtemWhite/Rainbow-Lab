import { useState, useMemo } from 'react'
import { spectrum } from './SpectrumTable'

function fresnelR(iDeg, rDeg) {
  const i = (iDeg * Math.PI) / 180
  const r = (rDeg * Math.PI) / 180
  const Rs = Math.pow(Math.sin(i - r) / Math.sin(i + r), 2)
  const Rp = Math.pow(Math.tan(i - r) / Math.tan(i + r), 2)
  return (Rs + Rp) / 2
}

function calcIntensityCurve(n, k) {
  const points = []
  for (let h = 5; h <= 149; h += 1.5) {
    const i = Math.asin(h / 150)
    const r = Math.asin(Math.sin(i) / n)
    const D = (k - 1) * 180 + 2 * (i * 180 / Math.PI) - 2 * k * (r * 180 / Math.PI)
    const theta = k === 2 ? (180 - D) : (D - 180)

    const R = fresnelR(i * 180 / Math.PI, r * 180 / Math.PI)
    const T = 1 - R
    const intensity = T * T * Math.pow(R, k - 1)
    points.push({ theta, intensity })
  }
  points.sort((a, b) => a.theta - b.theta)
  return points
}

export default function IntensityCurve() {
  const [nValue, setNValue] = useState(1.335)
  const [primaryK, setPrimaryK] = useState(2)
  const [secondaryK, setSecondaryK] = useState(3)
  const [lambda, setLambda] = useState(560)
  const [showSecondary, setShowSecondary] = useState(true)
  const [showTertiary, setShowTertiary] = useState(false)

  const primaryCurve = useMemo(() => calcIntensityCurve(nValue, primaryK), [nValue, primaryK])
  const secondaryCurve = useMemo(() => calcIntensityCurve(nValue, secondaryK), [nValue, secondaryK])
  const tertiaryCurve = useMemo(() => calcIntensityCurve(nValue, 4), [nValue])

  const allCurves = [primaryCurve]
  if (showSecondary) allCurves.push(secondaryCurve)
  if (showTertiary) allCurves.push(tertiaryCurve)

  const allTheta = allCurves.flatMap((c) => c.map((p) => p.theta))
  const allIntensity = allCurves.flatMap((c) => c.map((p) => p.intensity))
  const thetaMin = Math.floor(Math.min(...allTheta)) - 1
  const thetaMax = Math.ceil(Math.max(...allTheta)) + 1
  const intMax = Math.max(...allIntensity) * 1.2

  const chartW = 600, chartH = 300, padL = 50, padR = 30, padT = 20, padB = 45
  const plotW = chartW - padL - padR
  const plotH = chartH - padT - padB

  const toX = (theta) => padL + ((theta - thetaMin) / (thetaMax - thetaMin)) * plotW
  const toY = (int) => padT + plotH - (int / intMax) * plotH

  function buildPath(points) {
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.theta)} ${toY(p.intensity)}`).join(' ')
  }

  const peakPrimary = useMemo(() => {
    let max = primaryCurve[0]
    primaryCurve.forEach((p) => { if (p.intensity > max.intensity) max = p })
    return max
  }, [primaryCurve])

  const peakSecondary = useMemo(() => {
    let max = secondaryCurve[0]
    secondaryCurve.forEach((p) => { if (p.intensity > max.intensity) max = p })
    return max
  }, [secondaryCurve])

  return (
    <div>
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mb-xl p-lg bg-canvas-night-soft rounded-xs">
        <div className="space-y-md">
          <div>
            <label className="block text-micro-cap text-on-primary-mute mb-xxs">
              Показатель преломления n: <span className="text-white font-mono">{nValue.toFixed(4)}</span>
            </label>
            <input
              type="range" min={1.30} max={1.55} step={0.0005} value={nValue}
              onChange={(e) => setNValue(Number(e.target.value))}
              className="w-full accent-white"
            />
          </div>
          <div>
            <label className="block text-micro-cap text-on-primary-mute mb-xxs">
              Длина волны λ: <span className="text-white font-mono">{lambda} нм</span>
            </label>
            <div className="flex flex-wrap gap-xs">
              {spectrum.map((s) => (
                <button
                  key={s.wl}
                  onClick={() => {
                    setLambda(s.wl)
                    setNValue([1.3311, 1.3330, 1.3345, 1.3360, 1.3371, 1.3395, 1.3428][spectrum.indexOf(s)])
                  }}
                  className={`px-sm py-xxs rounded-pill text-xs border transition-colors ${
                    lambda === s.wl ? 'border-white text-white bg-white/10' : 'border-hairline-dark text-on-primary-mute hover:border-white/50'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-sm">
          <label className="flex items-center gap-sm text-sm text-on-primary-mute cursor-pointer">
            <input
              type="checkbox" checked={showSecondary}
              onChange={(e) => setShowSecondary(e.target.checked)}
              className="accent-white"
            />
            Показать вторичную радугу (k=2 отраж.)
          </label>
          <label className="flex items-center gap-sm text-sm text-on-primary-mute cursor-pointer">
            <input
              type="checkbox" checked={showTertiary}
              onChange={(e) => setShowTertiary(e.target.checked)}
              className="accent-white"
            />
            Показать третичную радугу (k=3 отраж.)
          </label>
        </div>
      </div>

      {/* Live data */}
      <div className="flex flex-wrap gap-lg text-sm font-mono text-on-primary-mute p-md bg-canvas-night-soft rounded-xs mb-xl">
        <span>n = <span className="text-white">{nValue.toFixed(4)}</span></span>
        <span>Пик I: <span className="text-white">{peakPrimary.theta.toFixed(1)}°</span></span>
        <span>I_max(I) = <span className="text-white">{(peakPrimary.intensity * 100).toFixed(2)}%</span></span>
        {showSecondary && (
          <>
            <span>Пик II: <span className="text-white/70">{peakSecondary.theta.toFixed(1)}°</span></span>
            <span>I_max(II) / I_max(I) = <span className="text-white/70">
              {(peakSecondary.intensity / peakPrimary.intensity).toFixed(1)}×</span>
            </span>
          </>
        )}
      </div>

      {/* Chart */}
      <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full max-w-[600px] mx-auto h-auto bg-canvas-night-soft rounded-xs">
        {/* Grid */}
        {[0, 0.02, 0.04, 0.06, 0.08].map((v) => (
          <g key={v}>
            <line x1={padL} y1={toY(v)} x2={chartW - padR} y2={toY(v)}
              stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
            <text x={padL - 8} y={toY(v) + 4} fill="rgba(255,255,255,0.4)"
              fontSize="9" fontFamily="Inter,sans-serif" textAnchor="end">{(v * 100).toFixed(0)}%</text>
          </g>
        ))}
        {(() => {
          const range = thetaMax - thetaMin
          const step = range > 50 ? 30 : range > 20 ? 10 : 5
          const first = Math.ceil(thetaMin / step) * step
          const ticks = []
          for (let v = first; v <= thetaMax; v += step) ticks.push(v)
          return ticks.map((v) => (
            <g key={v}>
              <line x1={toX(v)} y1={chartH - padB} x2={toX(v)} y2={padT}
                stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
              <text x={toX(v)} y={chartH - padB + 16} fill="rgba(255,255,255,0.4)"
                fontSize="9" fontFamily="Inter,sans-serif" textAnchor="middle">{v}°</text>
            </g>
          ))
        })()}

        {/* Axes */}
        <line x1={padL} y1={chartH - padB} x2={chartW - padR} y2={chartH - padB}
          stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <line x1={padL} y1={padT} x2={padL} y2={chartH - padB}
          stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

        {/* Primary curve */}
        <path d={buildPath(primaryCurve)} fill="none" stroke="white" strokeWidth="2" opacity="0.95" />

        {/* Secondary curve */}
        {showSecondary && (
          <path d={buildPath(secondaryCurve)} fill="none" stroke="rgba(255,255,255,0.5)"
            strokeWidth="1.5" strokeDasharray="6,3" />
        )}

        {/* Tertiary curve */}
        {showTertiary && (
          <path d={buildPath(tertiaryCurve)} fill="none" stroke="rgba(255,255,255,0.25)"
            strokeWidth="1" strokeDasharray="2,4" />
        )}

        {/* Peak markers */}
        <circle cx={toX(peakPrimary.theta)} cy={toY(peakPrimary.intensity)} r="5" fill="white" />
        {showSecondary && (
          <circle cx={toX(peakSecondary.theta)} cy={toY(peakSecondary.intensity)} r="4" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
        )}

        {/* Labels */}
        <text x={toX(peakPrimary.theta) + 10} y={toY(peakPrimary.intensity) - 8}
          fill="white" fontSize="10" fontFamily="Inter,sans-serif">Первичная</text>
        {showSecondary && (
          <text x={toX(peakSecondary.theta) + 8} y={toY(peakSecondary.intensity) - 8}
            fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="Inter,sans-serif">Вторичная</text>
        )}

        {/* Axis labels */}
        <text x={chartW / 2} y={chartH - 4} fill="rgba(255,255,255,0.35)"
          fontSize="10" fontFamily="Inter,sans-serif" textAnchor="middle">Угол θ от противосолнечной точки</text>
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-xl justify-center mt-md text-xs text-on-primary-mute">
        <span><span className="inline-block w-4 h-0.5 bg-white align-middle mr-sm" /> Первичная (1 отраж.)</span>
        {showSecondary && <span><span className="inline-block w-4 h-0.5 border-t border-dashed border-white/50 align-middle mr-sm" /> Вторичная (2 отраж.)</span>}
      </div>

      {/* Reference table */}
      <details className="mt-xl">
        <summary className="text-micro-cap text-on-primary-mute cursor-pointer hover:text-white transition-colors">
          Эталонная таблица интенсивности (вода, n=1.335) — нажмите, чтобы развернуть
        </summary>
        <div className="overflow-x-auto mt-md">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-hairline-dark">
                <th className="text-left py-sm px-md text-micro-cap text-on-primary-mute">θ, °</th>
                <th className="text-left py-sm px-md text-micro-cap text-on-primary-mute">I₁ (первичная)</th>
                <th className="text-left py-sm px-md text-micro-cap text-on-primary-mute">I₂ (вторичная)</th>
                <th className="text-left py-sm px-md text-micro-cap text-on-primary-mute">I₃ (третичная)</th>
              </tr>
            </thead>
            <tbody>
              {[37, 38, 39, 40, 41, 42, 43, 44, 49, 50, 51, 52, 53, 54].map((theta) => {
                const p1 = primaryCurve.find((p) => Math.abs(p.theta - theta) < 0.3)
                const p2 = secondaryCurve.find((p) => Math.abs(p.theta - theta) < 0.3)
                const p3 = tertiaryCurve.find((p) => Math.abs(p.theta - theta) < 0.3)
                return (
                  <tr key={theta} className="border-b border-hairline-dark hover:bg-canvas-night-soft transition-colors">
                    <td className="py-sm px-md font-mono">{theta}.0°</td>
                    <td className={`py-sm px-md font-mono ${p1 && p1.intensity > 0.04 ? 'text-white font-bold' : ''}`}>
                      {p1 ? (p1.intensity * 100).toFixed(2) + '%' : '—'}
                    </td>
                    <td className="py-sm px-md font-mono">
                      {p2 ? (p2.intensity * 100).toFixed(2) + '%' : '—'}
                    </td>
                    <td className="py-sm px-md font-mono text-on-primary-mute">
                      {p3 ? (p3.intensity * 100).toFixed(3) + '%' : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  )
}
