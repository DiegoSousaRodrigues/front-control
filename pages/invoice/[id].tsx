import InvoiceDetailScreen from '@/components/InvoiceDetailScreen'
import withLogin from '@/utils/withLogin'
export default function InvoiceDetailPage() {
  return <InvoiceDetailScreen />
}
export const getServerSideProps = withLogin
