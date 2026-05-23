import { Badge } from '@/components/ui/badge'

export default function AboutSection() {
  return (
    <section id="about" className="bg-canvas-night-soft text-center py-[120px] px-xxl">
      <div className="max-w-[1200px] mx-auto">
        <Badge className="mb-md">О проекте</Badge>
        <h2 className="display-lg mb-xl">Как рождается радуга</h2>
        <p className="text-base leading-[1.7] tracking-[0.32px] text-on-primary-mute max-w-[680px] mx-auto">
          Радуга — одно из самых красивых оптических явлений природы. Она возникает, когда солнечный свет преломляется, отражается и диспергирует в миллионах дождевых капель. Наша модель воспроизводит этот процесс на уровне геометрической оптики: от единичного луча до полной картины распределения цветов.
        </p>
      </div>
    </section>
  )
}
