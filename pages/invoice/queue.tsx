import InvoiceFormScreen from '@/components/InvoiceFormScreen'
import withLogin from '@/utils/withLogin'
export default function InvoiceQueuePage() {
  return <InvoiceFormScreen isSequence />
}
export const getServerSideProps = withLogin
