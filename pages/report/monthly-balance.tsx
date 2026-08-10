import withLogin from '@/utils/withLogin'

export default function MonthlyBalancePage() {
  return (
    <section className='flex flex-col gap-2 px-4 py-6 sm:px-8 lg:px-12' aria-labelledby='monthly-balance-title'>
      <h1 id='monthly-balance-title' className='text-lg font-semibold'>
        Balanço mensal
      </h1>
      <p className='text-sm text-gray-600'>Esta área será implementada em uma fase futura.</p>
    </section>
  )
}

export const getServerSideProps = withLogin
