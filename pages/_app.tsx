import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import MainLayout from '@/layout/MainLayout/MainLayout'
import '@/styles/globals.css'
import '@radix-ui/themes/styles.css'
import { MainProvider } from '@/contexts/MainContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnMount: false,
    },
  },
})

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <MainProvider>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </MainProvider>
    </QueryClientProvider>
  )
}
