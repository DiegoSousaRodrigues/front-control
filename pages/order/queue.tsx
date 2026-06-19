import QueueScreen from '@/components/QueueScreen'
import withLogin from '@/utils/withLogin'

export default function Queue() {
  return <QueueScreen />
}

export const getServerSideProps = withLogin
