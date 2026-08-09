import type { NextApiResponse } from 'next'
import { setCookie } from 'nookies'

export const SESSION_COOKIE_NAME = 'control-token'
export const LEGACY_USER_COOKIE_NAME = 'control-user'
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24

function getSessionCookieOptions() {
  return {
    httpOnly: true,
    path: '/',
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
  }
}

export function setSessionCookie(res: NextApiResponse, token: string) {
  setCookie({ res }, SESSION_COOKIE_NAME, token, {
    ...getSessionCookieOptions(),
    maxAge: SESSION_MAX_AGE_SECONDS,
  })
}

export function clearSessionCookie(res: NextApiResponse) {
  setCookie({ res }, SESSION_COOKIE_NAME, '', {
    ...getSessionCookieOptions(),
    maxAge: 0,
  })
}

export function clearLegacyUserCookie(res: NextApiResponse) {
  setCookie({ res }, LEGACY_USER_COOKIE_NAME, '', {
    maxAge: 0,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
}
