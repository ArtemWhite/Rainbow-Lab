export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-canvas-night overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.01)_30%,transparent_60%)]" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-30 blur-[30px]"
          style={{
            background: 'conic-gradient(from 180deg, #ff000033, #ff7f0033, #ffff0033, #00ff0033, #0000ff33, #4b008233, #8b00ff33, #ff000033)',
            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px))',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px))',
          }}
        />
      </div>

      {/* Floating droplets */}
      <div className="absolute top-[20%] left-[15%] w-10 h-10 rounded-full border border-white/8 animate-float pointer-events-none" />
      <div className="absolute top-[65%] right-[12%] w-[60px] h-[60px] rounded-full border border-white/8 animate-float-delay-1 pointer-events-none" />
      <div className="absolute bottom-[25%] left-[25%] w-[30px] h-[30px] rounded-full border border-white/8 animate-float-delay-2 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-[860px] px-xxl">
        <p className="text-micro-cap uppercase tracking-[0.96px] text-on-primary-mute mb-xl">
          Физическое моделирование
        </p>
        <h1 className="display-xxl mb-xl">
          <span className="block">Образование</span>
          <span className="block">радуги</span>
        </h1>
        <p className="text-base leading-[1.7] tracking-[0.32px] text-on-primary-mute max-w-[560px] mx-auto mb-huge">
          Дисперсия и многократное преломление света в каплях воды. Интерактивная модель хода лучей, разложение спектра и кривые интенсивности.
        </p>
        <div className="flex gap-md justify-center flex-wrap">
          <a href="#about" className="inline-flex items-center justify-center px-xl py-lg border border-white rounded-pill text-button-cap uppercase tracking-[1.17px] font-bold text-white bg-transparent hover:bg-white hover:text-black transition-colors">
            Узнать больше
          </a>
          <a href="#features" className="inline-flex items-center justify-center px-xl py-lg border border-white rounded-pill text-button-cap uppercase tracking-[1.17px] font-bold text-white bg-transparent hover:bg-white hover:text-black transition-colors">
            Возможности
          </a>
        </div>
      </div>
    </section>
  )
}
