import FormProduct from '@/components/FormProduct'
import withLogin from '@/utils/withLogin'

export default function Add() {
  return <FormProduct type='add' />
}

export const getServerSideProps = withLogin
