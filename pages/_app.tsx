import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MainLayout from '@/layout/MainLayout/MainLayout'
import '@/styles/globals.css'
import '@radix-ui/themes/styles.css'
import { MainProvider } from '@/contexts/MainContext'
import { AppProps } from 'next/app'
import { LayoutEnum } from '@/types/pageProps'
import { Fragment } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnMount: true,
    },
  },
})

export default function MyApp({ Component, pageProps }: AppProps) {
  const Layout = pageProps.layout == LayoutEnum.NONE ? Fragment : MainLayout
  return (
    <QueryClientProvider client={queryClient}>
      <MainProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </MainProvider>
    </QueryClientProvider>
  )
}
