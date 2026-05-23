import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import FeaturesSection from '@/components/sections/FeaturesSection'
import RainbowSection from '@/components/sections/RainbowSection'
import SimulationSection from '@/components/sections/SimulationSection'
import SimulationsSection from '@/components/sections/SimulationsSection'
import FooterSection from '@/components/sections/FooterSection'

export default function App() {
  return (
    <div className="bg-canvas-night text-on-primary">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-xxl py-xl bg-black/85 backdrop-blur-[12px]">
        <span className="text-base font-bold font-display uppercase tracking-[1.17px] text-white">
          Rainbow Lab
        </span>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink href="#about"> О проекте</NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="#features">Возможности</NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="#rainbow">Радуга</NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="#simulation">Моделирование</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </header>

      <main>
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <RainbowSection />
        <SimulationSection />
        <SimulationsSection />
      </main>

      <FooterSection />
    </div>
  )
}
