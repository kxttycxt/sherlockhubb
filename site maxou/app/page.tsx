import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Hero } from '@/components/home/hero'
import { StatsSection } from '@/components/home/stats-section'
import { JourneySection } from '@/components/home/journey-section'
import { FeaturesSection } from '@/components/home/features-section'
import { CtaSection } from '@/components/home/cta-section'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <StatsSection />
        <JourneySection />
        <FeaturesSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
