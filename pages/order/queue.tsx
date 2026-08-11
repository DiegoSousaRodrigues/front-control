import QueueScreen from '@/components/QueueScreen'
import { withBillingV2Redirect } from '@/utils/billingV2Redirect'
import { GetServerSidePropsContext } from 'next'

export default function Queue() {
  return <QueueScreen />
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  return withBillingV2Redirect(context, '/invoice/queue')
}
