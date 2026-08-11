import { afterEach, describe, expect, it } from 'vitest'
import { isBillingV2Enabled } from './billingV2'

describe('billing v2 cutover flag', () => {
  const original = process.env.NEXT_PUBLIC_BILLING_V2_ENABLED
  afterEach(() => {
    if (original === undefined) delete process.env.NEXT_PUBLIC_BILLING_V2_ENABLED
    else process.env.NEXT_PUBLIC_BILLING_V2_ENABLED = original
  })
  it('is inactive by default and requires an exact true value', () => {
    delete process.env.NEXT_PUBLIC_BILLING_V2_ENABLED
    expect(isBillingV2Enabled()).toBe(false)
    process.env.NEXT_PUBLIC_BILLING_V2_ENABLED = 'true'
    expect(isBillingV2Enabled()).toBe(true)
  })
})
