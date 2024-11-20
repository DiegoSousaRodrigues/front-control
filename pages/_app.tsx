import type { AppProps } from 'next/app'
import MainLayout from '@/layout/MainLayout/MainLayout'
import '@/styles/globals.css'
import '@radix-ui/themes/styles.css'
import { MainProvider } from '@/contexts/MainContext'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MainProvider>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </MainProvider>
  )
}
