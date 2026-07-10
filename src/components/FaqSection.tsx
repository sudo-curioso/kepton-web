'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import GetStartedLink from './GetStartedLink'
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from '@/lib/constants'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

interface FaqItem {
  question: string
  answer: string
}

const FAQS: FaqItem[] = [
  {
    question: 'What is Kepton, and who is it for?',
    answer:
      'Kepton is a focus and productivity app that turns your work sessions into a fun game by planting virtual trees as you complete tasks. It\u2019s built especially for adults with ADHD who want an engaging way to stay on track and build consistent habits.',
  },
  {
    question: 'How does the focus timer and tree planting work?',
    answer:
      'You start by choosing a task, then begin a focus timer. When the timer finishes successfully, you earn a tree planted in your personal virtual forest. This forest grows over time as you complete more focus sessions, helping motivate you to keep working steadily.',
  },
  {
    question: 'Is there a free version of Kepton?',
    answer:
      'Yes! You get a 14-day full-access free trial to explore all features. After that, there\u2019s an indefinite free tier that keeps the core habit loop active \u2014 including the timer, tree planting, a small virtual platform, and basic stats. Some advanced features are reserved for Pro subscribers.',
  },
  {
    question: 'What features are included in the Pro subscription?',
    answer:
      'Pro users unlock extras such as larger and more detailed virtual forests, in-depth performance charts, unlimited AI-powered planning, additional planning blocks, and seasonal themes for the forest. You can subscribe monthly or annually, with pricing details clearly shown in the app.',
  },
  {
    question: 'How does AI planning in Kepton help me?',
    answer:
      'The AI planner takes your input about energy levels, mood, deadlines, and notes to suggest a daily focus plan that adapts to your current needs. It creates structured schedule cards to help streamline your day, making planning less stressful and more personalized.',
  },
  {
    question: 'Can I use Kepton offline?',
    answer:
      'Absolutely. Kepton\u2019s timer and sessions work offline, storing your data locally when you don\u2019t have internet. Once you reconnect, your progress automatically syncs so nothing gets lost.',
  },
  {
    question: 'How secure is my data with Kepton?',
    answer:
      'Your privacy and security are top priorities. Kepton uses secure authentication, stores minimal personal data, encrypts communications, and enforces strict access controls. Sensitive data never stays on your device in unsecured form, and we follow best practices to keep your information safe.',
  },
  {
    question: 'What should I do if I forget my password?',
    answer:
      'You can easily reset your password through the app\u2019s \u201CForgot Password\u201D option. For your protection, the app won\u2019t reveal if an account email exists, maintaining privacy and security.',
  },
  {
    question: 'Can I manage or cancel my subscription within the app?',
    answer:
      'Yes, the user profile section lets you see your account details and provides direct links to manage your subscription on Google Play or the App Store. You can cancel or modify your plan anytime through those native stores.',
  },
  {
    question: 'What happens if I want to delete my Kepton account?',
    answer:
      'Deleting your account is straightforward but secure. You\u2019ll confirm your decision by entering your email, and the app will then soft-delete your personal data, cancel subscriptions, and fully erase your information after 7 days \u2014 ensuring your data is removed permanently.',
  },
  {
    question: 'How do I get started with Kepton?',
    answer:
      'Simply download the app, sign up with your email, and enjoy a smooth onboarding process with a quick welcome and access to your 14-day free trial. We\u2019ve kept everything user-friendly so you can focus on building habits.',
  },
]

function FaqAccordionItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: FaqItem
  index: number
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={fadeUp}
      custom={index + 1}
      className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl transition-colors duration-300 hover:border-white/[0.12]"
    >
      <button
        type="button"
        id={`faq-trigger-${index}`}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${index}`}
        onClick={onToggle}
        className="flex w-full items-start gap-4 px-5 py-5 text-left transition-colors sm:px-6 sm:py-5"
      >
        <span
          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs font-bold transition-all duration-300 ${
            isOpen
              ? 'border-[#22C55E]/40 bg-[#22C55E]/15 text-[#22C55E]'
              : 'border-white/[0.10] bg-white/[0.03] text-neutral-500'
          }`}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="min-w-0 flex-1">
          <span
            className={`block text-[15px] font-semibold leading-snug tracking-tight transition-colors duration-300 sm:text-base ${
              isOpen ? 'text-white' : 'text-neutral-200'
            }`}
          >
            {item.question}
          </span>
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors duration-300 ${
            isOpen
              ? 'border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E]'
              : 'border-white/[0.08] bg-white/[0.02] text-neutral-500'
          }`}
        >
          <ChevronDown className="h-4 w-4" aria-hidden />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-panel-${index}`}
            role="region"
            aria-labelledby={`faq-trigger-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/[0.06] px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
              <p className="pl-11 text-sm leading-relaxed text-neutral-400 sm:text-[15px] sm:leading-[1.75]">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section
      id="faqs"
      className="relative overflow-hidden bg-[#0a0a0a] px-4 py-28 sm:px-6 lg:px-8"
    >
      {/* Ambient background glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[420px] w-[520px] -translate-x-1/2 rounded-full bg-emerald-600/[0.06] blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 h-[300px] w-[300px] translate-x-1/2 rounded-full bg-emerald-500/[0.04] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-3xl">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          custom={0}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#22C55E]">
            FAQs
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
            Questions? We&apos;ve got answers.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-400 sm:text-lg">
            Everything you need to know about Kepton — from focus timers and forests to
            privacy, pricing, and getting started.
          </p>
        </motion.div>

        {/* Accordion list */}
        <div className="flex flex-col gap-3">
          {FAQS.map((item, i) => (
            <FaqAccordionItem
              key={item.question}
              item={item}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(prev => (prev === i ? null : i))}
            />
          ))}
        </div>

        {/* Footer CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={fadeUp}
          custom={FAQS.length + 1}
          className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-6 py-8 text-center backdrop-blur-xl sm:flex-row sm:justify-between sm:text-left"
        >
          <div className="flex items-start gap-3 sm:items-center">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#22C55E]/25 bg-[#22C55E]/10 text-[#22C55E]">
              <HelpCircle className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">Still have questions?</p>
              <p className="mt-0.5 text-sm text-neutral-500">
                Email us at{' '}
                <a
                  href={SUPPORT_MAILTO}
                  className="font-medium text-[#22C55E] transition-colors hover:text-emerald-400"
                >
                  {SUPPORT_EMAIL}
                </a>{' '}
                — we&apos;re happy to help.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:items-end">
            <GetStartedLink className="rounded-xl bg-[#22C55E] px-5 py-2.5 text-sm font-bold text-black shadow-[0_8px_24px_rgba(34,197,94,0.3)] transition-all hover:brightness-105">
              Get started free
            </GetStartedLink>
            <a
              href={SUPPORT_MAILTO}
              className="text-xs font-medium text-neutral-500 transition-colors hover:text-white"
            >
              Contact support
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
