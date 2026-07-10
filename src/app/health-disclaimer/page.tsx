import type { Metadata } from 'next'
import LegalDocument from '@/components/LegalDocument'
import { getPolicy } from '@/lib/policies'

export const metadata: Metadata = {
  title: 'Health & Wellness Disclaimer | Kepton',
  description:
    'Kepton is a productivity and wellness tool, not a medical device or clinical treatment.',
}

export default function HealthDisclaimerPage() {
  return <LegalDocument document={getPolicy('health')} />
}
