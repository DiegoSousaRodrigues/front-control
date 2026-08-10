import ClientBalanceScreen from '@/components/ClientBalanceScreen'
import withLogin from '@/utils/withLogin'

export default function ClientBalancePage() {
  return <ClientBalanceScreen />
}

export const getServerSideProps = withLogin
