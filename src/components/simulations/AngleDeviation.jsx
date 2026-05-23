import { useState, useMemo } from 'react'
import { spectrum } from './SpectrumTable'

const waterN = [1.3311, 1.3330, 1.3345, 1.3360, 1.3371, 1.3395, 1.3428]

function calcDescartes(n, k) {
  const val = (n * n - 1) / (k * k - 1)
  if (val <= 0 || val >= 1) return { i: 0, r: 0, D: 0, rainbow: 0 }
  const cosI = Math.sqrt(val)
  const i = Math.acos(cosI)
  const r = Math.asin(Math.sin(i) / n)
  const D = (k - 1) * 180 + 2 * (i * 180 / Math.PI) - 2 * k * (r * 180 / Math.PI)
  return {
    i: i * 180 / Math.PI,
    r: r * 180 / Math.PI,
    D,
    rainbow: k === 2 ? (180 - D) : (D - 180),
  }
}

function niceStep(span) {
  if (span <= 0.3) return 0.05
  if (span <= 0.6) return 0.1
  if (span <= 1.2) return 0.2
  if (span <= 2.5) return 0.5
  if (span <= 6) return 1
  if (span <= 12) return 2
  if (span <= 25) return 5
  return 10
}

export default function AngleDeviation() {
  const [zoom, setZoom] = useState(1)
  const [lambda, setLambda] = useState(560)
  const [reflections, setReflections] = useState(2)
  const [nValue, setNValue] = useState(1.3345)

  const k = reflections + 1
  const zoomLevels = [1, 2, 3, 4, 5, 10, 15, 20, 30]
  const descartes = useMemo(() => calcDescartes(nValue, k), [nValue, k])

  const primaryData = useMemo(() => spectrum.map((s) => {
    const ni = waterN[spectrum.indexOf(s)]
    const d = calcDescartes(ni, 2)
    return { ...s, n: ni, ...d }
  }), [])

  const secondaryData = useMemo(() => spectrum.map((s) => {
    const ni = waterN[spectrum.indexOf(s)]
    const d = calcDescartes(ni, 3)
    return { ...s, n: ni, ...d }
  }), [])

  // Water-reference angles for each k
  const refWater = useMemo(() => {
    const res = {}
    for (let kr = 2; kr <= 5; kr++) {
      res[kr] = spectrum.map((s) => {
        const ni = waterN[spectrum.indexOf(s)]
        return { ...s, theta: calcDescartes(ni, kr).rainbow }
      })
    }
    return res
  }, [])

  // Current n positions
  const nAngles = useMemo(() => {
    const res = {}
    for (let kr = 2; kr <= 5; kr++) {
      res[kr] = spectrum.map((s) => ({
        ...s, theta: calcDescartes(nValue, kr).rainbow,
      }))
    }
    return res
  }, [nValue])

  // ---- Polar chart geometry ----
  const chartSize = 480, cx = chartSize / 2, cy = chartSize / 2, r = 180

  // Focus window
  const fullRange = 55
  const focusAngle = useMemo(() => {
    // Descartes angle for current k with water's n≈1.335
    return calcDescartes(1.335, k).rainbow
  }, [k])

  const visibleRange = fullRange / zoom
  const minVisible = zoom === 1 ? 0 : Math.max(0, focusAngle - visibleRange / 2)
  const maxVisible = zoom === 1 ? fullRange : minVisible + visibleRange

  // Map angle → radius (normalised to [minVisible, maxVisible])
  const angleToR = (theta) => {
    if (theta < minVisible || theta > maxVisible) return null
    const frac = (theta - minVisible) / (maxVisible - minVisible)
    return r * Math.max(0, Math.min(1, frac))
  }

  // Angle-circle labels (auto-spaced)
  const angleCircles = useMemo(() => {
    const span = maxVisible - minVisible
    const step = niceStep(span)
    const first = Math.ceil(minVisible / step) * step
    const ticks = []
    for (let v = first; v <= maxVisible + step * 0.01; v += step) {
      if (v >= 0) ticks.push(v)
    }
    return ticks
  }, [minVisible, maxVisible])

  // ---- Linear chart ----
  const linW = 480, linH = 80, linPadL = 60, linPadR = 20, linPadT = 8, linPadB = 24
  const linPlotW = linW - linPadL - linPadR

  const linThetaMin = useMemo(() => {
    let mn = Infinity
    for (const arr of Object.values(refWater)) arr.forEach(d => { if (d.theta > 0 && d.theta < mn) mn = d.theta })
    for (const arr of Object.values(nAngles)) arr.forEach(d => { if (d.theta > 0 && d.theta < mn) mn = d.theta })
    return Math.floor(mn - 1)
  }, [refWater, nAngles])

  const linThetaMax = useMemo(() => {
    let mx = -Infinity
    for (const arr of Object.values(refWater)) arr.forEach(d => { if (d.theta > mx) mx = d.theta })
    for (const arr of Object.values(nAngles)) arr.forEach(d => { if (d.theta > mx) mx = d.theta })
    return Math.ceil(mx + 1)
  }, [refWater, nAngles])

  const linRange = linThetaMax - linThetaMin
  const linStep = nValue >= 1.4 ? 20 : linRange > 50 ? 10 : linRange > 20 ? 5 : 2

  const linToX = (theta) => linPadL + ((theta - linThetaMin) / linRange) * linPlotW

  return (
    <div>
      {/* Interactive controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-xl p-lg bg-canvas-night-soft rounded-xs">
        <div>
          <label className="block text-micro-cap text-on-primary-mute mb-xxs">
            Показатель преломления n: <span className="text-white font-mono">{nValue.toFixed(4)}</span>
          </label>
          <input
            type="range" min={1.30} max={1.60} step={0.0001} value={nValue}
            onChange={(e) => {
              setNValue(Number(e.target.value))
              const closest = spectrum.reduce((prev, curr) => {
                const np = waterN[spectrum.indexOf(prev)]
                const nc = waterN[spectrum.indexOf(curr)]
                return Math.abs(nc - Number(e.target.value)) < Math.abs(np - Number(e.target.value)) ? curr : prev
              })
              setLambda(closest.wl)
            }}
            className="w-full accent-white"
          />
        </div>
        <div>
          <label className="block text-micro-cap text-on-primary-mute mb-xxs">
            Число внутренних отражений k: <span className="text-white font-mono">{reflections}</span>
          </label>
          <input
            type="range" min={1} max={3} value={reflections}
            onChange={(e) => setReflections(Number(e.target.value))}
            className="w-full accent-white"
          />
          <div className="flex justify-between text-xs text-on-primary-mute">
            <span>1 (первичная)</span><span>2 (вторичная)</span><span>3</span>
          </div>
        </div>
        <div>
          <label className="block text-micro-cap text-on-primary-mute mb-xxs">
            Длина волны λ: <span className="text-white font-mono">{lambda} нм</span>
          </label>
          <div className="flex flex-wrap gap-xs">
            {spectrum.map((s) => (
              <button
                type="button"
                key={s.wl}
                onClick={() => {
                  setLambda(s.wl)
                  setNValue(waterN[spectrum.indexOf(s)])
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

      {/* Live calculation */}
      <div className="flex flex-wrap gap-lg text-sm font-mono text-on-primary-mute p-md bg-canvas-night-soft rounded-xs mb-xl">
        <span>n = <span className="text-white">{nValue.toFixed(4)}</span></span>
        <span>k = <span className="text-white">{reflections}</span> ({(reflections + 1)} отражений)</span>
        <span>i₀ = <span className="text-white">{descartes.i.toFixed(1)}°</span></span>
        <span>r₀ = <span className="text-white">{descartes.r.toFixed(1)}°</span></span>
        <span>D<sub>min</sub> = <span className="text-white">{descartes.D.toFixed(1)}°</span></span>
        <span>θ<sub>радуги</sub> = <span className="text-white font-bold">{descartes.rainbow.toFixed(1)}°</span></span>
        {zoom > 1 && (
          <span className="text-white/60">Zoom {zoom}× | [{minVisible.toFixed(1)}° – {maxVisible.toFixed(1)}°]</span>
        )}
      </div>

      {/* Angular distribution visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl mb-xl">
        {/* Polar chart */}
        <div>
          {/* Zoom control */}
          <div className="flex items-center gap-xs mb-md justify-center flex-wrap">
            <span className="text-xs text-on-primary-mute mr-xs">Zoom:</span>
            {zoomLevels.map((z) => (
              <button
                type="button"
                key={z}
                onClick={() => setZoom(z)}
                className={`px-sm py-xxs rounded-pill text-xs border transition-colors ${
                  zoom === z ? 'border-white text-white bg-white/10' : 'border-hairline-dark text-on-primary-mute hover:border-white/50'
                }`}
              >
                {z}×
              </button>
            ))}
          </div>

          <div className="flex justify-center">
            <svg viewBox={`0 0 ${chartSize} ${chartSize}`} className="w-full max-w-[480px] h-auto">
              {/* Anti-solar direction */}
              {zoom === 1 && (
                <>
                  <line x1={cx} y1={cy} x2={cx} y2={30} stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                  <text x={cx} y={24} fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="Inter,sans-serif" textAnchor="middle">Противосолнечная точка</text>
                  <line x1={cx} y1={cy} x2={cx} y2={chartSize - 30} stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4,4" />
                  <text x={cx} y={chartSize - 24} fill="rgba(255,255,255,0.25)" fontSize="9" fontFamily="Inter,sans-serif" textAnchor="middle">Солнце</text>
                </>
              )}

              {/* Angle circles */}
              {angleCircles.map((angle) => {
                const rr = angleToR(angle)
                if (rr === null) return null
                return (
                  <g key={angle}>
                    <circle cx={cx} cy={cy} r={rr}
                      fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" />
                    <text x={cx + rr + 4} y={cy + 4}
                      fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="Inter,sans-serif">{angle}°</text>
                  </g>
                )
              })}

              {/* Reference rings (I: k=2, II: k=3) when not active */}
              {k !== 2 && refWater[2].map((d) => {
                const rr = angleToR(d.theta)
                if (rr === null) return null
                const rad = (d.theta * Math.PI) / 180
                const ax = cx + rr * Math.sin(rad)
                const ay = cy - rr * Math.cos(rad)
                return (
                  <circle key={`rp-${d.wl}`} cx={ax} cy={ay} r="3"
                    fill="none" stroke={d.color} strokeWidth="0.5" opacity="0.35" />
                )
              })}

              {k !== 3 && refWater[3].map((d) => {
                const rr = angleToR(d.theta)
                if (rr === null) return null
                const rad = (d.theta * Math.PI) / 180
                const ax = cx + rr * Math.sin(rad)
                const ay = cy - rr * Math.cos(rad)
                return (
                  <circle key={`rs-${d.wl}`} cx={ax} cy={ay} r="3"
                    fill="none" stroke={d.color} strokeWidth="0.5" opacity="0.35" />
                )
              })}

              {/* Water-reference dots for current k */}
              {refWater[k] && refWater[k].map((d) => {
                const rr = angleToR(d.theta)
                if (rr === null) return null
                const rad = (d.theta * Math.PI) / 180
                const arcX = cx + rr * Math.sin(rad)
                const arcY = cy - rr * Math.cos(rad)
                return (
                  <g key={d.wl}>
                    <circle cx={arcX} cy={arcY} r="10" fill={d.color} opacity="0.95" stroke="white" strokeWidth="0.5" />
                    <text x={arcX + 14} y={arcY + 5} fill="rgba(255,255,255,0.8)" fontSize="11" fontFamily="Inter,sans-serif" fontWeight="700">
                      {d.theta.toFixed(1)}°
                    </text>
                  </g>
                )
              })}

              {/* N-slider positions (white outlines) */}
              {nAngles[k] && nAngles[k].map((d) => {
                const rr = angleToR(d.theta)
                if (rr === null) return null
                const rad = (d.theta * Math.PI) / 180
                const arcX = cx + rr * Math.sin(rad)
                const arcY = cy - rr * Math.cos(rad)
                return (
                  <circle key={`nn-${d.wl}`} cx={arcX} cy={arcY} r="5"
                    fill="none" stroke="white" strokeWidth="2" opacity="0.85" />
                )
              })}

              {/* Legend for primary/secondary */}
              {zoom === 1 && (
                <>
                  <text x={cx + r * 42 / fullRange + 18} y={cy - r * 42 / fullRange + 6}
                    fill="white" fontSize="10" fontFamily="Inter,sans-serif" fontWeight="700">I</text>
                  <text x={cx + r * 51 / fullRange + 18} y={cy - r * 51 / fullRange + 6}
                    fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="Inter,sans-serif">II</text>
                </>
              )}

              {/* Active label */}
              <text x={30} y={chartSize - 18} fill="white" fontSize="11" fontFamily="Inter,sans-serif" fontWeight="600">
                ● k = {reflections} ({k === 2 ? 'первичная' : k === 3 ? 'вторичная' : `${k}-го порядка`})
              </text>

              {/* Observer */}
              <circle cx={cx} cy={cy} r="5" fill="white" />
              <text x={cx + 10} y={cy + 14} fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="Inter,sans-serif">Наблюдатель</text>
            </svg>
          </div>
        </div>

        {/* Description + Linear theta chart */}
        <div className="text-sm leading-relaxed text-on-primary-mute space-y-md">
          <p>
            <span className="text-white font-bold">Первичная радуга (I, k=1):</span> одно внутреннее отражение.
            Угловой радиус ≈ 42°. Красный — снаружи, фиолетовый — внутри.
          </p>
          <p>
            <span className="text-white/70 font-bold">Вторичная радуга (II, k=2):</span> два отражения.
            Радиус ≈ 51°. Порядок цветов обратный.
          </p>
          <p>
            <span className="text-on-primary-mute/60">Третичная радуга (k=3):</span> три отражения,
            наблюдается вокруг солнца (~38°), крайне слабая.
          </p>

          {/* Linear theta-by-color chart */}
          <div className="mt-lg">
            <p className="text-micro-cap text-on-primary-mute mb-sm">
              Линейная шкала: θ для k={reflections}
              <span className="text-white ml-sm">— толстые точки: эталон (вода)</span>
              <span className="ml-sm" style={{ opacity: 0.7 }}>— обводка: текущее n={nValue.toFixed(3)}</span>
            </p>
            <svg viewBox={`0 0 ${linW} ${linH}`} className="w-full max-w-[480px] h-auto bg-canvas-night-soft rounded-xs">
              {/* I reference line */}
              <line x1={linPadL} y1={16} x2={linW - linPadR} y2={16} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
              <text x={linPadL - 8} y={20} fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="Inter,sans-serif" textAnchor="end">I</text>

              {/* II reference line */}
              <line x1={linPadL} y1={42} x2={linW - linPadR} y2={42} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
              <text x={linPadL - 8} y={46} fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="Inter,sans-serif" textAnchor="end">II</text>

              {/* k reference line */}
              <line x1={linPadL} y1={linH - linPadB - 8} x2={linW - linPadR} y2={linH - linPadB - 8} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
              <text x={linPadL - 8} y={linH - linPadB - 4} fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="Inter,sans-serif" textAnchor="end">k</text>

              {/* Primary reference dots (line I) */}
              {refWater[2] && refWater[2].map((d) => (
                <circle key={`lp-${d.wl}`} cx={linToX(d.theta)} cy={16} r="3" fill={d.color} opacity="0.25" />
              ))}

              {/* Secondary reference dots (line II) */}
              {refWater[3] && refWater[3].map((d) => (
                <circle key={`ls-${d.wl}`} cx={linToX(d.theta)} cy={42} r="3" fill={d.color} opacity="0.25" />
              ))}

              {/* Current k reference (water n, thick dots on line k) */}
              {refWater[k] && refWater[k].map((d) => (
                <circle key={`lck-${d.wl}`} cx={linToX(d.theta)} cy={linH - linPadB - 8} r="6" fill={d.color} opacity="0.9" stroke="white" strokeWidth="0.5" />
              ))}

              {/* Current n positions (white outlines on line k) */}
              {nAngles[k] && nAngles[k].map((d) => (
                <circle key={`lcn-${d.wl}`} cx={linToX(d.theta)} cy={linH - linPadB - 8} r="8"
                  fill="none" stroke="white" strokeWidth="2" opacity="0.7" />
              ))}

              {/* Axis */}
              <line x1={linPadL} y1={linH - linPadB} x2={linW - linPadR} y2={linH - linPadB}
                stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

              {/* Tick labels */}
              {(() => {
                const first = Math.ceil(linThetaMin / linStep) * linStep
                const ticks = []
                for (let v = first; v <= linThetaMax; v += linStep) ticks.push(v)
                return ticks.map((v) => (
                  <g key={v}>
                    <line x1={linToX(v)} y1={linH - linPadB} x2={linToX(v)} y2={linH - linPadB + 4}
                      stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                    <text x={linToX(v)} y={linH - 4} fill="rgba(255,255,255,0.35)"
                      fontSize="9" fontFamily="Inter,sans-serif" textAnchor="middle">{v}°</text>
                  </g>
                ))
              })()}
            </svg>
          </div>

          <p className="text-xs">
            Кнопки Zoom фокусируют полярную диаграмму на узком диапазоне вокруг угла радуги для выбранного k. Белые обводки = текущее n. При k=3 (третичная) шаг оси X = 10°.
          </p>
        </div>
      </div>

      {/* Reference tables */}
      <details className="mt-xl">
        <summary className="text-micro-cap text-on-primary-mute cursor-pointer hover:text-white transition-colors">
          Эталонные таблицы (вода, 20°C) — нажмите, чтобы развернуть
        </summary>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg mt-md">
          <div className="overflow-x-auto">
            <p className="text-xs text-on-primary-mute mb-sm">Первичная радуга (k=1)</p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-hairline-dark">
                  <th className="text-left py-sm px-md text-micro-cap text-on-primary-mute">Цвет</th>
                  <th className="text-left py-sm px-md text-micro-cap text-on-primary-mute">n</th>
                  <th className="text-left py-sm px-md text-micro-cap text-on-primary-mute">θ, °</th>
                </tr>
              </thead>
              <tbody>
                {primaryData.map((r) => (
                  <tr key={r.wl} className="border-b border-hairline-dark">
                    <td className="py-sm px-md"><span className="inline-block w-3 h-3 rounded-full mr-sm" style={{ backgroundColor: r.color }} />{r.name}</td>
                    <td className="py-sm px-md font-mono">{r.n.toFixed(4)}</td>
                    <td className="py-sm px-md font-mono font-bold">{r.rainbow.toFixed(1)}°</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="overflow-x-auto">
            <p className="text-xs text-on-primary-mute mb-sm">Вторичная радуга (k=2)</p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-hairline-dark">
                  <th className="text-left py-sm px-md text-micro-cap text-on-primary-mute">Цвет</th>
                  <th className="text-left py-sm px-md text-micro-cap text-on-primary-mute">n</th>
                  <th className="text-left py-sm px-md text-micro-cap text-on-primary-mute">θ, °</th>
                </tr>
              </thead>
              <tbody>
                {secondaryData.map((r) => (
                  <tr key={r.wl} className="border-b border-hairline-dark">
                    <td className="py-sm px-md"><span className="inline-block w-3 h-3 rounded-full mr-sm" style={{ backgroundColor: r.color }} />{r.name}</td>
                    <td className="py-sm px-md font-mono">{r.n.toFixed(4)}</td>
                    <td className="py-sm px-md font-mono font-bold">{r.rainbow.toFixed(1)}°</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </details>
    </div>
  )
}
