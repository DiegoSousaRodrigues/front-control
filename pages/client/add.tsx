import FormClient from '@/components/FormClient'
import withLogin from '@/utils/withLogin'

export default function Add() {
  return <FormClient type='add' />
}

export const getServerSideProps = withLogin
