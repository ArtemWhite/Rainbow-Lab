export default function FooterSection() {
  return (
    <footer className="bg-canvas-night border-t border-hairline-dark py-xxl text-center">
      <p className="text-micro-cap text-on-primary-mute">
        Моделирование по физике &bull; ИТМО &bull; 4 семестр &bull;{' '}
        <a
          href="https://github.com/VoltAgent/awesome-design-md"
          className="text-white underline hover:opacity-70 transition-opacity"
        >
          Дизайн-система SpaceX
        </a>
        {' '}&bull;{' '}
        <a
          href="https://github.com/shadcn-ui/ui"
          className="text-white underline hover:opacity-70 transition-opacity"
        >
          shadcn/ui
        </a>
      </p>
    </footer>
  )
}
