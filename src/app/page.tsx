'use client'

import LightRays from '@/components/LightRays'
import NavBar from '@/components/NavBar'

export default function HomePage() {
  return (
    <section className="relative h-dvh w-full overflow-hidden bg-[#0d0d0f] text-white">
      <div aria-hidden className="absolute inset-0 z-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
        />
      </div>

      <NavBar />

      <div className="relative z-10 flex h-full w-full flex-col pt-20">
        <main className="flex flex-1 flex-col items-center justify-center px-6 pb-24 text-center">
          <h1 className="mb-10 max-w-3xl text-[2.5rem] font-semibold leading-[1.08] tracking-tight sm:text-6xl md:text-7xl">
            May these lights guide
            <br />
            you on your path
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              className="rounded-lg bg-[#e8e8ea] px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-white"
            >
              Get started
            </button>
            <button
              type="button"
              className="rounded-lg border border-white/15 bg-transparent px-5 py-2.5 text-sm font-medium text-white/60 transition-colors hover:border-white/30 hover:text-white/90"
            >
              Learn more
            </button>
          </div>
        </main>
      </div>
    </section>
  )
}
