import FormOrder from '@/components/FormOrder'
import withLogin from '@/utils/withLogin'

export default function Add() {
  return <FormOrder />
}

export const getServerSideProps = withLogin
