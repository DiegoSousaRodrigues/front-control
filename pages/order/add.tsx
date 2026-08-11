import FormOrder from '@/components/FormOrder'
import { withBillingV2Redirect } from '@/utils/billingV2Redirect'
import { GetServerSidePropsContext } from 'next'

export default function Add() {
  return <FormOrder />
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  return withBillingV2Redirect(context, '/invoice/add')
}
