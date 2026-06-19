import withLogin from '@/utils/withLogin'

export default function Home() {
  return <div className='font-bold'>Home</div>
}

export const getServerSideProps = withLogin
