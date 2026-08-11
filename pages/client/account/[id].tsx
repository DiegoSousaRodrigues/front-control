import AccountScreen from '@/components/AccountScreen'
import withLogin from '@/utils/withLogin'
export default function ClientAccountPage() {
  return <AccountScreen />
}
export const getServerSideProps = withLogin
