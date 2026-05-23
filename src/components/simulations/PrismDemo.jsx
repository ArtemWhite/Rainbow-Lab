import { useState, useMemo } from 'react'
import { spectrum } from './SpectrumTable'

const materials = {
  water: { label: 'Вода', A: 1.324, B: 3090, C: 0 },
  crown: { label: 'Крон (стекло)', A: 1.504, B: 4430, C: 0 },
  flint: { label: 'Флинт (стекло)', A: 1.715, B: 13800, C: 0 },
  diamond: { label: 'Алмаз', A: 2.410, B: 15600, C: 0 },
}

function calcN(lambda, A, B, C) {
  const l2 = lambda * lambda
  return A + B / l2 + C / (l2 * l2)
}

function traceRay(n, apexRad, i1) {
  // i1 = incidence angle (rad) from left-face inward normal
  const sinR1 = Math.sin(i1) / n
  if (sinR1 > 1) return { tir: true, stage: 'entry' }
  const r1 = Math.asin(sinR1)

  // Internal incidence on right face: i2' = A - r1
  const i2prime = apexRad - r1
  if (i2prime <= 0) return { tir: true, stage: 'miss' }
  const sinI2 = n * Math.sin(i2prime)
  if (sinI2 > 1) return { tir: true, stage: 'exit_tir', i2prime }
  const i2 = Math.asin(sinI2)

  const D = ((i1 + i2 - apexRad) * 180) / Math.PI
  return { tir: false, D, i1, r1, i2prime, i2 }
}

export default function PrismDemo() {
  const [apex, setApex] = useState(60)
  const [incidenceDeg, setIncidenceDeg] = useState(30)
  const [material, setMaterial] = useState('crown')
  const [customA, setCustomA] = useState(materials.crown.A)
  const [customB, setCustomB] = useState(materials.crown.B)
  const [customC, setCustomC] = useState(materials.crown.C)
  const [lambda, setLambda] = useState(560)

  const n = useMemo(() => calcN(lambda, customA, customB, customC), [lambda, customA, customB, customC])
  const apexRad = (apex * Math.PI) / 180
  const i1rad = (incidenceDeg * Math.PI) / 180

  const rayResult = useMemo(() => traceRay(n, apexRad, i1rad), [n, apexRad, i1rad])

  // Trace for each wavelength
  const colorRays = useMemo(() =>
    spectrum.map((s) => {
      const ni = calcN(s.wl, customA, customB, customC)
      const result = traceRay(ni, apexRad, i1rad)
      return { ...s, n: ni, ...result }
    }),
  [customA, customB, customC, apexRad, i1rad])

  const validRays = colorRays.filter((c) => !c.tir)
  const anyTIR = colorRays.some((c) => c.tir)

  // SVG geometry
  const sideLen = 180
  const topX = 180
  const topY = 50
  const leftX = topX - sideLen * Math.sin(apexRad / 2)
  const leftY = topY + sideLen * Math.cos(apexRad / 2)
  const rightX = topX + sideLen * Math.sin(apexRad / 2)
  const rightY = leftY

  // Entry point on left face (midpoint)
  const entryX = (topX + leftX) / 2
  const entryY = (topY + leftY) / 2

  // Incident ray direction (from air)
  const alpha = apexRad / 2
  const dInc = { x: Math.cos(alpha - i1rad), y: Math.sin(alpha - i1rad) }

  const rayLen = 140

  // For each valid ray, compute:
  // - internal direction, exit point on right face, exit direction
  const rayGeom = useMemo(() =>
    validRays.map((c) => {
      const r1 = c.r1
      const i2 = c.i2
      // Internal ray direction in prism
      const dInt = { x: Math.cos(alpha - r1), y: Math.sin(alpha - r1) }

      // Intersect internal ray with right face
      // Right face: (topX, topY) + u * (rightX-topX, rightY-topY), u in [0,1]
      const rfx = rightX - topX
      const rfy = rightY - topY
      const Dx = entryX - topX
      const Dy = entryY - topY

      const det = dInt.x * (-rfy) - dInt.y * (-rfx)
      if (Math.abs(det) < 1e-9) return null
      const t = (Dx * rfy - Dy * rfx) / det
      const u = (dInt.y * Dx - dInt.x * Dy) / det

      if (t <= 0 || u < 0 || u > 1) return null

      const exitPt = { x: entryX + t * dInt.x, y: entryY + t * dInt.y }

      // Exit direction: right face outward normal nR_out = (cos(alpha), -sin(alpha))
      // Exit ray angle from horizontal: -alpha + i2
      const dExit = { x: Math.cos(i2 - alpha), y: Math.sin(i2 - alpha) }

      return { ...c, dInt, exitPt, dExit }
    }).filter(Boolean),
  [validRays, alpha, entryX, entryY, topX, topY, rightX, rightY])

  return (
    <div>
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-lg mb-xl p-lg bg-canvas-night-soft rounded-xs">
        <div>
          <label className="block text-micro-cap text-on-primary-mute mb-xxs">
            Угол при вершине A: <span className="text-white font-mono">{apex}°</span>
          </label>
          <input
            type="range" min={20} max={85} value={apex}
            onChange={(e) => setApex(Number(e.target.value))}
            className="w-full accent-white"
          />
          <div className="flex justify-between text-xs text-on-primary-mute">
            <span>20°</span><span>60°</span><span>85°</span>
          </div>
        </div>
        <div>
          <label className="block text-micro-cap text-on-primary-mute mb-xxs">
            Угол падения: <span className="text-white font-mono">{incidenceDeg}°</span>
          </label>
          <input
            type="range" min={5} max={75} value={incidenceDeg}
            onChange={(e) => setIncidenceDeg(Number(e.target.value))}
            className="w-full accent-white"
          />
          <div className="flex justify-between text-xs text-on-primary-mute">
            <span>5°</span><span>{apex / 2}° (нормаль)</span><span>75°</span>
          </div>
        </div>
        <div>
          <label className="block text-micro-cap text-on-primary-mute mb-xxs">Материал</label>
          <div className="flex flex-wrap gap-xs mb-sm">
            {Object.entries(materials).map(([key, m]) => (
              <button
                type="button"
                key={key}
                onClick={() => {
                  setMaterial(key)
                  setCustomA(m.A)
                  setCustomB(m.B)
                  setCustomC(m.C)
                }}
                className={`px-sm py-xxs rounded-pill text-xs border transition-colors ${
                  material === key ? 'border-white text-white bg-white/10' : 'border-hairline-dark text-on-primary-mute hover:border-white/50'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
          <div className="flex gap-xs">
            <input type="number" value={customA} step={0.001} onChange={(e) => { setCustomA(Number(e.target.value)); setMaterial('') }}
              className="w-full bg-canvas-night border border-hairline-dark rounded-xs px-sm py-xs text-xs text-white font-mono" placeholder="A" />
            <input type="number" value={customB} step={1} onChange={(e) => { setCustomB(Number(e.target.value)); setMaterial('') }}
              className="w-full bg-canvas-night border border-hairline-dark rounded-xs px-sm py-xs text-xs text-white font-mono" placeholder="B" />
            <input type="number" value={customC} step={1} onChange={(e) => { setCustomC(Number(e.target.value)); setMaterial('') }}
              className="w-full bg-canvas-night border border-hairline-dark rounded-xs px-sm py-xs text-xs text-white font-mono" placeholder="C" />
          </div>
        </div>
        <div>
          <label className="block text-micro-cap text-on-primary-mute mb-xxs">
            Длина волны λ: <span className="text-white font-mono">{lambda} нм</span>
          </label>
          <input
            type="range" min={380} max={780} value={lambda}
            onChange={(e) => setLambda(Number(e.target.value))}
            className="w-full accent-white"
          />
          <div className="flex flex-wrap gap-xs mt-sm">
            {spectrum.map((s) => (
              <button
                type="button"
                key={s.wl}
                onClick={() => setLambda(s.wl)}
                className={`px-sm py-xxs rounded-pill text-xs border transition-colors ${
                  lambda === s.wl ? 'border-white text-white bg-white/10' : 'border-hairline-dark text-on-primary-mute hover:border-white/50'
                }`}
              >
                <span className="inline-block w-2 h-2 rounded-full mr-xs" style={{ backgroundColor: s.color }} />
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live calculation */}
      {!anyTIR && rayResult.tir === false ? (
        <div className="flex flex-wrap gap-lg text-sm font-mono text-on-primary-mute p-md bg-canvas-night-soft rounded-xs mb-xl">
          <span>A = <span className="text-white">{apex}°</span></span>
          <span>n = <span className="text-white">{n.toFixed(4)}</span></span>
          <span>i₁ = <span className="text-white">{incidenceDeg}°</span></span>
          <span>r₁ = <span className="text-white">{((rayResult.r1 * 180) / Math.PI).toFixed(1)}°</span></span>
          <span>i₂' = <span className="text-white">{((rayResult.i2prime * 180) / Math.PI).toFixed(1)}°</span></span>
          <span>i₂ = <span className="text-white">{((rayResult.i2 * 180) / Math.PI).toFixed(1)}°</span></span>
          <span>D = <span className="text-white font-bold">{rayResult.D.toFixed(1)}°</span></span>
          {validRays.length > 1 && (
            <span>ΔD (дисперсия) = <span className="text-white">
              {(validRays[validRays.length - 1].D - validRays[0].D).toFixed(1)}°
            </span></span>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-lg text-sm font-mono text-on-primary-mute p-md bg-canvas-night-soft rounded-xs mb-xl">
          <span>A = <span className="text-white">{apex}°</span></span>
          <span>n = <span className="text-white">{n.toFixed(4)}</span></span>
          <span>i₁ = <span className="text-white">{incidenceDeg}°</span></span>
          {rayResult.tir && (
            <span className="text-red-300 font-bold">
              {rayResult.stage === 'entry' ? 'ПВО на входной грани! Уменьшите i₁' :
               rayResult.stage === 'exit_tir' ? 'ПВО на выходной грани! Увеличьте A или уменьшите i₁' :
               'Луч не попадает на выходную грань'}
            </span>
          )}
          {!rayResult.tir && anyTIR && <span className="text-yellow-300">Часть длин волн испытывает ПВО</span>}
        </div>
      )}

      {/* SVG Diagram */}
      <div className="flex justify-center mb-xl">
        <svg viewBox="-80 0 560 300" className="w-full max-w-[560px] h-auto bg-canvas-night-soft rounded-xs">
          <defs>
            <linearGradient id="prismSpecGrad" x1="0" y1="0" x2="0" y2="1">
              {validRays.map((c, i) => (
                <stop key={c.wl} offset={`${(i / Math.max(validRays.length - 1, 1)) * 100}%`} stopColor={c.color} />
              ))}
            </linearGradient>
          </defs>

          {/* Prism */}
          <polygon points={`${topX},${topY} ${leftX},${leftY} ${rightX},${rightY}`}
            fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

          {/* Incident ray (white) */}
          <line
            x1={entryX - rayLen * dInc.x} y1={entryY - rayLen * dInc.y}
            x2={entryX} y2={entryY}
            stroke="rgba(255,255,255,0.6)" strokeWidth="2"
          />

          {/* Entry point */}
          <circle cx={entryX} cy={entryY} r="3" fill="white" />

          {/* Internal rays + exit rays for each wavelength */}
          {rayGeom.map((g) => (
            <g key={g.wl}>
              {/* Internal ray */}
              <line
                x1={entryX} y1={entryY}
                x2={g.exitPt.x} y2={g.exitPt.y}
                stroke={g.color} strokeWidth="1.5" opacity="0.6"
              />
              {/* Exit ray */}
              <line
                x1={g.exitPt.x} y1={g.exitPt.y}
                x2={g.exitPt.x + 130 * g.dExit.x} y2={g.exitPt.y + 130 * g.dExit.y}
                stroke={g.color} strokeWidth="1.5" opacity="0.9"
              />
              {/* Exit point */}
              <circle cx={g.exitPt.x} cy={g.exitPt.y} r="2" fill={g.color} opacity="0.8" />
            </g>
          ))}

          {/* Screen / projection */}
          {rayGeom.length > 0 && (() => {
            const screenX = rightX + 100
            const projections = rayGeom.map((g) => {
              const tScreen = (screenX - g.exitPt.x) / (g.dExit.x || 0.001)
              return g.exitPt.y + tScreen * g.dExit.y
            })
            const projMin = Math.min(...projections)
            const projMax = Math.max(...projections)
            const spread = Math.max(projMax - projMin, 10)

            return (
              <>
                <rect x={screenX} y={projMin - 4} width="14" height={spread + 8} rx="3"
                  fill="url(#prismSpecGrad)" opacity="0.9" />
                {/* Lines to screen */}
                {rayGeom.map((g, i) => {
                  const tScreen = (screenX - g.exitPt.x) / (g.dExit.x || 0.001)
                  const sy = g.exitPt.y + tScreen * g.dExit.y
                  return (
                    <line key={g.wl}
                      x1={g.exitPt.x} y1={g.exitPt.y}
                      x2={screenX} y2={sy}
                      stroke={g.color} strokeWidth="0.5" opacity="0.3" />
                  )
                })}
                <text x={screenX + 20} y={projMin - 10} fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="Inter,sans-serif">Экран</text>
              </>
            )
          })()}

          {/* Labels */}
          <text x={entryX - 80} y={entryY - 14} fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="Inter,sans-serif">
            Белый свет (i₁={incidenceDeg}°)
          </text>
          <text x={topX} y={topY - 10} fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="Inter,sans-serif" textAnchor="middle">A={apex}°</text>

          {/* Normal indicator at entry */}
          <line
            x1={entryX - 20 * Math.cos(alpha)} y1={entryY - 20 * Math.sin(alpha)}
            x2={entryX + 20 * Math.cos(alpha)} y2={entryY + 20 * Math.sin(alpha)}
            stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" strokeDasharray="3,3" />
        </svg>
      </div>

      {/* Legend */}
      <p className="text-xs text-on-primary-mute text-center mb-xl leading-relaxed max-w-[600px] mx-auto">
        Ползунок <span className="text-white">«Угол падения»</span> управляет наклоном входящего луча относительно нормали к левой грани.
        При i₁ = A/2 луч идёт горизонтально; при увеличении — рассеивается вниз; при уменьшении — концентрируется вверх.
        Чем больше разница в углах выхода, тем шире спектр на экране.
        {anyTIR && <span className="text-red-300"> Часть лучей испытывает полное внутреннее отражение.</span>}
      </p>

      {/* Reference table */}
      <details className="mt-xl">
        <summary className="text-micro-cap text-on-primary-mute cursor-pointer hover:text-white transition-colors">
          Эталонная таблица (крон, A=60°, i₁=30°) — нажмите, чтобы развернуть
        </summary>
        <div className="overflow-x-auto mt-md">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-hairline-dark">
                <th className="text-left py-sm px-md text-micro-cap text-on-primary-mute">Цвет</th>
                <th className="text-left py-sm px-md text-micro-cap text-on-primary-mute">λ, нм</th>
                <th className="text-left py-sm px-md text-micro-cap text-on-primary-mute">n (крон)</th>
                <th className="text-left py-sm px-md text-micro-cap text-on-primary-mute">D, °</th>
              </tr>
            </thead>
            <tbody>
              {colorRays.map((c) => (
                <tr key={c.wl} className="border-b border-hairline-dark hover:bg-canvas-night-soft transition-colors">
                  <td className="py-sm px-md">
                    <span className="inline-block w-3 h-3 rounded-full mr-sm" style={{ backgroundColor: c.color }} />
                    {c.name}
                  </td>
                  <td className="py-sm px-md font-mono">{c.wl}</td>
                  <td className="py-sm px-md font-mono">{c.n.toFixed(3)}</td>
                  <td className="py-sm px-md font-mono font-bold">{c.tir ? 'ПВО' : `${c.D.toFixed(1)}°`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  )
}
