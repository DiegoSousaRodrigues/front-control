import LoginScreen from '@/components/LoginScreen'
import { LayoutEnum } from '@/types/pageProps'

export default function Login() {
  return <LoginScreen />
}

export async function getServerSideProps() {
  return { props: { layout: LayoutEnum.NONE } }
}
