import { afterEach, describe, expect, it, vi } from 'vitest'

const withLogin = vi.hoisted(() => vi.fn(() => ({ props: { legacy: true } })))
vi.mock('./withLogin', () => ({ default: withLogin }))
import { withBillingV2Redirect } from './billingV2Redirect'

describe('legacy order cutover redirect', () => {
  const original = process.env.NEXT_PUBLIC_BILLING_V2_ENABLED
  afterEach(() => {
    if (original === undefined) delete process.env.NEXT_PUBLIC_BILLING_V2_ENABLED
    else process.env.NEXT_PUBLIC_BILLING_V2_ENABLED = original
  })
  it.each([['/invoice/add'], ['/invoice/list'], ['/invoice/queue']])(
    'redirects to %s only when billing v2 is enabled',
    (destination) => {
      process.env.NEXT_PUBLIC_BILLING_V2_ENABLED = 'true'
      expect(withBillingV2Redirect({} as never, destination)).toEqual({ redirect: { destination, permanent: false } })
    }
  )
  it('keeps the authenticated legacy page when the flag is absent', () => {
    delete process.env.NEXT_PUBLIC_BILLING_V2_ENABLED
    const context = {} as never
    expect(withBillingV2Redirect(context, '/invoice/add')).toEqual({ props: { legacy: true } })
    expect(withLogin).toHaveBeenCalledWith(context)
  })
})
