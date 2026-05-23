import { Badge } from '@/components/ui/badge'
import SpectrumTable from '@/components/simulations/SpectrumTable'
import RayTraceDemo from '@/components/simulations/RayTraceDemo'
import AngleDeviation from '@/components/simulations/AngleDeviation'
import IntensityCurve from '@/components/simulations/IntensityCurve'
import PrismDemo from '@/components/simulations/PrismDemo'

export default function SimulationsSection() {
  return (
    <section id="simulations" className="bg-canvas-night-soft py-[120px] px-xxl">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-huge">
          <Badge className="mb-md">Интерактивные симуляции</Badge>
          <h2 className="display-lg">Расчёты и модели</h2>
          <p className="text-on-primary-mute text-sm mt-md max-w-[640px] mx-auto leading-relaxed">
            Каждый раздел содержит ползунки, поля ввода и живые графики. Меняйте параметры — визуализация обновляется мгновенно. Эталонные таблицы доступны по клику.
          </p>
        </div>

        <div className="space-y-huge">
          {/* 1. Ray tracing */}
          <div id="sim-ray" className="bg-canvas-night border border-hairline-dark rounded-sm p-xxl">
            <h3 className="font-display text-xl font-bold uppercase tracking-[0.6px] mb-md">
              1. Ход луча в сферической капле
            </h3>
            <p className="text-sm text-on-primary-mute mb-xl leading-relaxed max-w-[680px]">
              Ползунки для длины волны, прицельного параметра и коэффициентов Коши. Луч входит в каплю, преломляется, отражается от задней стенки и выходит. Поддерживается 2D-схема, 3D-вид (вращайте мышью) и эталонная таблица. Углы — по закону Снеллиуса.
            </p>
            <RayTraceDemo />
          </div>

          {/* 2. Spectrum */}
          <div id="sim-spectrum" className="bg-canvas-night border border-hairline-dark rounded-sm p-xxl">
            <h3 className="font-display text-xl font-bold uppercase tracking-[0.6px] mb-md">
              2. Разложение белого света по длинам волн
            </h3>
            <p className="text-sm text-on-primary-mute mb-xl leading-relaxed max-w-[680px]">
              Выберите материал (вода, крон, флинт, алмаз) или введите свои коэффициенты A, B, C формулы Коши. График n(λ) и таблица пересчитываются на лету. Ползунок λ показывает конкретную точку на кривой.
            </p>
            <SpectrumTable />
          </div>

          {/* 3. Deviation angles */}
          <div id="sim-angles" className="bg-canvas-night border border-hairline-dark rounded-sm p-xxl">
            <h3 className="font-display text-xl font-bold uppercase tracking-[0.6px] mb-md">
              3. Углы отклонения и распределение цветов
            </h3>
            <p className="text-sm text-on-primary-mute mb-xl leading-relaxed max-w-[680px]">
              Ползунок показателя преломления, выбор числа отражений и длины волны. Полярная диаграмма показывает угловое распределение цветов для первичной и вторичной радуги. Луч Декарта вычисляется в реальном времени.
            </p>
            <AngleDeviation />
          </div>

          {/* 4. Intensity curves */}
          <div id="sim-intensity" className="bg-canvas-night border border-hairline-dark rounded-sm p-xxl">
            <h3 className="font-display text-xl font-bold uppercase tracking-[0.6px] mb-md">
              4. Кривые интенсивности
            </h3>
            <p className="text-sm text-on-primary-mute mb-xl leading-relaxed max-w-[680px]">
              Ползунок n и чекбоксы для включения первичной, вторичной и третичной радуги. Кривые строятся по формулам Френеля — учитываются потери на отражение при каждом пересечении границы капли. Пики интенсивности отмечены на графике.
            </p>
            <IntensityCurve />
          </div>

          {/* 5. Prism */}
          <div id="sim-prism" className="bg-canvas-night border border-hairline-dark rounded-sm p-xxl">
            <h3 className="font-display text-xl font-bold uppercase tracking-[0.6px] mb-md">
              5. Разложение в материале: стеклянная призма
            </h3>
            <p className="text-sm text-on-primary-mute mb-xl leading-relaxed max-w-[680px]">
              Регулируемый угол при вершине (20°–85°), выбор материала, ползунок λ. SVG-диаграмма перерисовывается под выбранные параметры. При возникновении полного внутреннего отражения выводится предупреждение.
            </p>
            <PrismDemo />
          </div>
        </div>
      </div>
    </section>
  )
}
