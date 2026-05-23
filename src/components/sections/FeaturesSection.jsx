import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

const features = [
  {
    num: '01',
    title: 'Ход луча в капле',
    desc: 'Геометрическая оптика внутри сферической капли воды: вход, преломление по закону Снеллиуса, внутреннее отражение и выход луча.',
  },
  {
    num: '02',
    title: 'Разложение по длинам волн',
    desc: 'Белый свет раскладывается в спектр от 380 нм (фиолетовый) до 780 нм (красный). Каждая длина волны имеет свой показатель преломления.',
  },
  {
    num: '03',
    title: 'Углы отклонения',
    desc: 'Расчёт и визуализация углов отклонения для каждого цвета. Распределение цветов по угловому расстоянию от противосолнечной точки.',
  },
  {
    num: '04',
    title: 'Кривые интенсивности',
    desc: 'Построение зависимости интенсивности от угла для первичной (±42°) и вторичной (±51°) радуги с учётом коэффициентов Френеля.',
  },
  {
    num: '05',
    title: 'Разложение в материале',
    desc: 'Моделирование дисперсии света в призме треугольного сечения — альтернативная геометрия для демонстрации спектрального разложения.',
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-canvas-night py-[120px] px-xxl">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-huge">
          <Badge className="mb-md">Функциональность</Badge>
          <h2 className="display-lg">Что моделируем</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-hairline-dark">
          {features.slice(0, 4).map((f) => (
            <Card key={f.num} className="border-0 bg-canvas-night p-huge">
              <CardHeader>
                <span className="text-[60px] font-bold font-display leading-[0.95] tracking-[1.2px] text-hairline-dark">
                  {f.num}
                </span>
                <CardTitle>{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{f.desc}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-[1px] max-w-[500px] mx-auto">
          <Card className="border-0 bg-canvas-night p-huge">
            <CardHeader>
              <span className="text-[60px] font-bold font-display leading-[0.95] tracking-[1.2px] text-hairline-dark">
                {features[4].num}
              </span>
              <CardTitle>{features[4].title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{features[4].desc}</CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
