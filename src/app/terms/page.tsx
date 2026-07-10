import type { Metadata } from 'next'
import LegalDocument from '@/components/LegalDocument'
import { getPolicy } from '@/lib/policies'

export const metadata: Metadata = {
  title: 'Terms & Conditions | Kepton',
  description: 'Terms of Service governing use of the Kepton mobile application and kepton.app.',
}

export default function TermsPage() {
  return <LegalDocument document={getPolicy('terms')} />
}
