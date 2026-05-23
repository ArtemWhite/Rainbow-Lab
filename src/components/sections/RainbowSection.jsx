import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function RainbowSection() {
  return (
    <section id="rainbow" className="bg-canvas-night-soft py-[120px] px-xxl">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-huge">
          <Badge className="mb-md">Виды радуги</Badge>
          <h2 className="display-lg">Первичная и вторичная</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-xxl">
          {/* Primary rainbow */}
          <Card className="p-huge rounded-sm">
            <CardHeader>
              <p className="text-micro-cap text-on-primary-mute mb-md">Одно внутреннее отражение</p>
              <CardTitle className="!text-[28px] tracking-[0.8px]">Первичная радуга</CardTitle>
            </CardHeader>
            <CardDescription className="mb-xl">
              Луч входит в каплю, преломляется, отражается от задней стенки один раз и выходит обратно. Угловой радиус ≈ 42°. Красный цвет — снаружи дуги, фиолетовый — внутри.
            </CardDescription>
            <div className="h-[200px] rounded-xs bg-canvas-night-soft flex items-center justify-center overflow-hidden">
              <div
                className="w-full h-[60px] rounded opacity-70"
                style={{ background: 'linear-gradient(to right, #4b0082, #0000ff, #00ff00, #ffff00, #ff7f00, #ff0000)' }}
              />
            </div>
          </Card>

          {/* Secondary rainbow */}
          <Card className="p-huge rounded-sm">
            <CardHeader>
              <p className="text-micro-cap text-on-primary-mute mb-md">Два внутренних отражения</p>
              <CardTitle className="!text-[28px] tracking-[0.8px]">Вторичная радуга</CardTitle>
            </CardHeader>
            <CardDescription className="mb-xl">
              Луч отражается внутри капли дважды перед выходом. Угловой радиус ≈ 51°. Цвета идут в обратном порядке: красный — внутри, фиолетовый — снаружи. Интенсивность ниже.
            </CardDescription>
            <div className="h-[200px] rounded-xs bg-canvas-night-soft flex items-center justify-center overflow-hidden">
              <div
                className="w-full h-[60px] rounded opacity-70"
                style={{ background: 'linear-gradient(to left, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082)' }}
              />
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
