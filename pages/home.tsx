export default function Home() {
  return <div className='font-bold'>Home</div>
}

export const getServerSideProps = async () => {
  return { props: {} }
}
