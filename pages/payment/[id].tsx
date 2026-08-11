import PaymentDetailScreen from '@/components/PaymentDetailScreen'
import withLogin from '@/utils/withLogin'
export default function PaymentDetailPage() {
  return <PaymentDetailScreen />
}
export const getServerSideProps = withLogin
