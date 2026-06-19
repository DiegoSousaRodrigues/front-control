import ProductScreen from '@/components/ProductScreen'
import withLogin from '@/utils/withLogin'

export default function List() {
  return <ProductScreen />
}

export const getServerSideProps = withLogin
