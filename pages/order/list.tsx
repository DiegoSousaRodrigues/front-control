import OrderScreen from '@/components/OrderScreen'
import withLogin from '@/utils/withLogin'

export default function List() {
  return <OrderScreen />
}

export const getServerSideProps = withLogin
