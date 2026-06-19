import { useForm } from 'react-hook-form'
import { Input } from '../lib/Input/Input'
import { LoginForm } from './LoginScreen.types'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'
import { useState } from 'react'
import { MdLockOutline, MdLogin } from 'react-icons/md'

export function LoginScreen() {
  const { register, handleSubmit } = useForm<LoginForm>()
  const { signIn } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(data: LoginForm) {
    setError('')
    setLoading(true)

    try {
      await signIn(data)
    } catch {
      setError('Login ou senha invalidos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen w-full items-center justify-center bg-gray-100 px-4 py-8'>
      <div className='grid w-full max-w-[920px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-table-row md:grid-cols-[1fr_420px]'>
        <section className='hidden flex-col justify-between bg-primary p-10 text-white md:flex'>
          <div>
            <Image alt='Control' src='/images/logo.png' width={92} height={92} className='rounded-lg bg-white p-2' />
            <h1 className='mt-8 text-3xl font-bold leading-tight'>Controle seus pedidos com mais clareza.</h1>
            <p className='mt-4 max-w-sm text-sm text-white/85'>
              Acesse clientes, produtos e filas de pedidos em um painel simples para a rotina do dia a dia.
            </p>
          </div>

          <div className='flex items-center gap-3 text-sm text-white/85'>
            <span className='flex h-9 w-9 items-center justify-center rounded-lg bg-white/15'>
              <MdLockOutline size={20} />
            </span>
            <span>Sessao protegida por autenticacao.</span>
          </div>
        </section>

        <form onSubmit={handleSubmit(onSubmit)} className='flex w-full flex-col gap-5 p-6 sm:p-8'>
          <div className='flex items-center gap-3 md:hidden'>
            <Image alt='Control' src='/images/logo.png' width={48} height={48} />
            <span className='text-lg font-bold text-primary'>Control</span>
          </div>

          <div>
            <h2 className='text-2xl font-bold text-gray-900'>Entrar</h2>
            <p className='mt-1 text-sm text-gray-500'>Informe suas credenciais para continuar.</p>
          </div>

          <div className='flex flex-col gap-4'>
            <Input label='login' autoComplete='username' {...register('login', { required: true })} />
            <Input
              label='senha'
              type='password'
              autoComplete='current-password'
              {...register('password', { required: true })}
            />
          </div>

          {error && <span className='rounded-md bg-red-50 px-3 py-2 text-sm text-error'>{error}</span>}

          <button
            className='flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 font-bold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60'
            disabled={loading}
          >
            <MdLogin size={20} />
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
