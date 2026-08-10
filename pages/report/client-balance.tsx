import withLogin from '@/utils/withLogin'

export default function ClientBalancePage() {
  return (
    <section className='flex flex-col gap-2 px-4 py-6 sm:px-8 lg:px-12' aria-labelledby='client-balance-title'>
      <h1 id='client-balance-title' className='text-lg font-semibold'>
        Balanço por cliente
      </h1>
      <p className='text-sm text-gray-600'>Consulte os resultados consolidados de um cliente.</p>
    </section>
  )
}

export const getServerSideProps = withLogin
