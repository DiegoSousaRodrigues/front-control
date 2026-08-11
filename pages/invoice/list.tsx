import InvoiceListScreen from '@/components/InvoiceListScreen'
import withLogin from '@/utils/withLogin'
export default function InvoiceListPage() {
  return <InvoiceListScreen />
}
export const getServerSideProps = withLogin
