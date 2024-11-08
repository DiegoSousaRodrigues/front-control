import type { AppProps } from 'next/app'
import MainLayout from '@/layout/MainLayout/MainLayout'
import '@/styles/globals.css'
import '@radix-ui/themes/styles.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MainLayout>
      <Component {...pageProps} />
    </MainLayout>
  )
}
