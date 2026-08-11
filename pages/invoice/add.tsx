import InvoiceFormScreen from '@/components/InvoiceFormScreen'
import withLogin from '@/utils/withLogin'
export default function InvoiceAddPage() {
  return <InvoiceFormScreen />
}
export const getServerSideProps = withLogin
