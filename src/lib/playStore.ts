import { PLAY_STORE_URL } from './constants'

/** Set to "true" in .env.local once the app is published on Google Play. */
export function isPlayStoreLive(): boolean {
  return process.env.NEXT_PUBLIC_PLAY_STORE_LIVE === 'true'
}

export function getPlayStoreUrl(): string {
  return PLAY_STORE_URL
}
