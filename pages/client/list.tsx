import ClientScreen from '@/components/ClientScreen'
import withLogin from '@/utils/withLogin'

export default function List() {
  return <ClientScreen />
}

export const getServerSideProps = withLogin
