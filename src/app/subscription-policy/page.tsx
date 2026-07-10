import type { Metadata } from 'next'
import LegalDocument from '@/components/LegalDocument'
import { getPolicy } from '@/lib/policies'

export const metadata: Metadata = {
  title: 'Subscription & Refund Policy | Kepton',
  description:
    'Kepton Pro subscription billing, cancellation, and refund terms for Apple App Store and Google Play.',
}

export default function SubscriptionPolicyPage() {
  return <LegalDocument document={getPolicy('subscription')} />
}
