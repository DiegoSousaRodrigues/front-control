import OrderScreen from '@/components/OrderScreen'
import { withBillingV2Redirect } from '@/utils/billingV2Redirect'
import { GetServerSidePropsContext } from 'next'

export default function List() {
  return <OrderScreen />
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  return withBillingV2Redirect(context, '/invoice/list')
}
