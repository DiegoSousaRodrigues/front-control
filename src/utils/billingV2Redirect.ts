import { GetServerSidePropsContext } from 'next'
import { isBillingV2Enabled } from './billingV2'
import withLogin from './withLogin'

export function withBillingV2Redirect(context: GetServerSidePropsContext, destination: string) {
  if (isBillingV2Enabled()) return { redirect: { destination, permanent: false } }
  return withLogin(context)
}
