import { Input } from '../lib/Input/Input'

export function LoginScreen() {
  return (
    <div className='flex w-full h-full bg-gray-100 items-center justify-center'>
      <div className='flex w-[400px] h-[350px] bg-white px-6 py-4 '>
        <div className='w-full flex flex-col gap-4'>
          <Input label='login' />
          <Input label='senha' />
          
        </div>
      </div>
    </div>
  )
}
