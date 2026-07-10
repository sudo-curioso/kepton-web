import type { Metadata } from 'next'
import DownloadPage from '@/components/DownloadPage'

export const metadata: Metadata = {
  title: 'Download Kepton | Google Play',
  description: 'Download Kepton on Google Play and start growing your focus forest.',
}

export default function DownloadRoute() {
  return <DownloadPage />
}
