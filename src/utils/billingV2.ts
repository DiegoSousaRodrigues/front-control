export function isBillingV2Enabled(): boolean {
  return process.env.NEXT_PUBLIC_BILLING_V2_ENABLED === 'true'
}
