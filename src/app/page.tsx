'use client'

import HeroHeadline from '@/components/HeroHeadline'
import FeaturesSection from '@/components/FeaturesSection'
import ForestHeroVisual from '@/components/ForestHeroVisual'
import HowItWorksSection from '@/components/HowItWorksSection'
import ReminderSection from '@/components/ReminderSection'
import ForestSection from '@/components/ForestSection'
import PlannerSection from '@/components/PlannerSection'
import RoadmapSection from '@/components/RoadmapSection'
import PricingSection from '@/components/PricingSection'
import ComparisonSection from '@/components/ComparisonSection'
import BlogSection from '@/components/BlogSection'
import FaqSection from '@/components/FaqSection'
import LightRays from '@/components/LightRays'
import NavBar from '@/components/NavBar'
import GetStartedLink from '@/components/GetStartedLink'
import SiteFooter from '@/components/SiteFooter'

export default function HomePage() {
  return (
    <>
      <section className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0a] text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] h-full min-h-screen w-full"
        >
          <LightRays
            raysOrigin="top-center"
            raysColor="#F0FDF4"
            raysSpeed={0.55}
            lightSpread={0.38}
            rayLength={1.35}
            fadeDistance={1.2}
            saturation={0.72}
            intensity={0.42}
            followMouse
            mouseInfluence={0.035}
            noiseAmount={0.025}
            distortion={0.018}
            className="h-full min-h-screen w-full"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_0%,rgba(240,253,244,0.07)_0%,transparent_55%)]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#0a0a0a_88%)]"
          />
        </div>

        <NavBar />

        <div className="relative z-10 flex w-full flex-col pt-[max(5.5rem,calc(env(safe-area-inset-top)+4.5rem))] sm:pt-24">
          <main className="flex flex-col items-center px-4 pb-10 text-center sm:px-6">
            <HeroHeadline />

            <p className="mt-5 max-w-2xl text-base font-normal leading-relaxed text-neutral-400 sm:mt-6 sm:text-lg md:text-xl">
              Focus tools built for clarity — capture tasks, stay on track, and watch your
              forest grow with every session.
            </p>

            <div className="mt-7 flex w-full max-w-sm flex-col items-stretch gap-3 sm:mt-8 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
              <GetStartedLink className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#F5F5F5] px-5 py-3 text-sm font-semibold text-[#0a0a0a] transition-colors hover:bg-white sm:py-2.5">
                Get started
              </GetStartedLink>
              <a
                href="/#features"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/[0.08] bg-[#111111] px-5 py-3 text-sm font-medium text-neutral-400 transition-colors hover:border-white/[0.14] hover:text-white sm:py-2.5"
              >
                Learn more
              </a>
            </div>

            <ForestHeroVisual />
          </main>
        </div>
      </section>

      <FeaturesSection />
      <HowItWorksSection />
      <ReminderSection />
      <ForestSection />
      <PlannerSection />
      <RoadmapSection />
      <ComparisonSection />
      <PricingSection />
      <BlogSection />
      <FaqSection />
      <SiteFooter />
    </>
  )
}
