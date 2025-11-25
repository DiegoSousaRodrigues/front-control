import { useForm } from 'react-hook-form'
import { Input } from '../lib/Input/Input'
import { LoginForm } from './LoginScreen.types'
import axios from 'axios'

export function LoginScreen() {
  const { register, handleSubmit } = useForm<LoginForm>()

  function onSubmit(data: LoginForm) {
    axios.post('api/login', data)
  }

  return (
    <div className='flex w-full h-full bg-gray-100 items-center justify-center'>
      <div className='flex w-[400px] bg-white px-6 py-6 rounded-lg'>
        <form onSubmit={handleSubmit(onSubmit)} className='w-full flex flex-col gap-4'>
          <h1 className='text-2xl text-center font-bold'>Login</h1>
          <Input label='login' {...register('login', { required: true })} />
          <Input label='senha' {...register('password', { required: true })} />
          <button className='py-4 rounded-lg bg-primary text-white font-bold'>Entrar</button>
        </form>
      </div>
    </div>
  )
}
