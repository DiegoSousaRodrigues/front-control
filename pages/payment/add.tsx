import PaymentFormScreen from '@/components/PaymentFormScreen'
import withLogin from '@/utils/withLogin'
export default function PaymentAddPage() {
  return <PaymentFormScreen />
}
export const getServerSideProps = withLogin
