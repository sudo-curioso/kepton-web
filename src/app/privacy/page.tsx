import type { Metadata } from 'next'
import LegalDocument from '@/components/LegalDocument'
import { getPolicy } from '@/lib/policies'

export const metadata: Metadata = {
  title: 'Privacy Policy | Kepton',
  description: 'How Kepton collects, uses, and protects your information.',
}

export default function PrivacyPage() {
  return <LegalDocument document={getPolicy('privacy')} />
}
