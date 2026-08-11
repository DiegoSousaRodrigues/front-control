import PaymentListScreen from '@/components/PaymentListScreen'
import withLogin from '@/utils/withLogin'
export default function PaymentListPage() {
  return <PaymentListScreen />
}
export const getServerSideProps = withLogin
