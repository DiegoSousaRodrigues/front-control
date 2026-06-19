import { useForm } from 'react-hook-form'
import { LoginForm } from './LoginScreen.types'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'
import { useState } from 'react'
import {
  MdInventory2,
  MdLogin,
  MdOutlinePerson,
  MdOutlineVisibility,
  MdOutlineVisibilityOff,
  MdReceiptLong,
} from 'react-icons/md'

export function LoginScreen() {
  const { register, handleSubmit } = useForm<LoginForm>()
  const { signIn } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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
    <div className='relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#f6f7f9] px-4 py-8 text-gray-900'>
      <div className='absolute inset-0 bg-[linear-gradient(#e5e7eb_1px,transparent_1px),linear-gradient(90deg,#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px] opacity-50' />
      <main className='relative grid w-full max-w-[1040px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.16)] lg:grid-cols-[1.08fr_440px]'>
        <section className='hidden min-h-[620px] flex-col justify-between bg-[#111827] p-10 text-white lg:flex'>
          <div className='flex items-center gap-4'>
            <Image alt='Control' src='/images/logo.png' width={72} height={72} className='rounded-lg bg-white p-2' />
            <div>
              <span className='text-2xl font-bold leading-none'>Control</span>
              <p className='mt-1 text-sm text-gray-300'>Painel operacional</p>
            </div>
          </div>

          <div className='space-y-8'>
            <div>
              <span className='rounded-md bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-white'>
                Workspace
              </span>
              <h1 className='mt-5 max-w-md text-4xl font-bold leading-tight'>Pedidos, clientes e produtos no mesmo fluxo.</h1>
              <p className='mt-4 max-w-md text-sm leading-6 text-gray-300'>
                Entre para acompanhar a operacao, atualizar status e manter a fila organizada.
              </p>
            </div>

            <div className='rounded-lg border border-white/10 bg-white/[0.04] p-4'>
              <div className='mb-4 flex items-center justify-between'>
                <span className='text-sm font-bold'>Ambiente protegido</span>
                <span className='rounded-md bg-white/10 px-2 py-1 text-xs font-bold text-gray-200'>Login necessario</span>
              </div>

              <div className='space-y-3'>
                <div className='flex items-center gap-3 rounded-md bg-white/[0.06] px-3 py-3'>
                  <span className='flex h-9 w-9 items-center justify-center rounded-md bg-secondary/15 text-secondary'>
                    <MdReceiptLong size={20} />
                  </span>
                  <div>
                    <span className='block text-sm font-bold text-gray-100'>Pedidos</span>
                    <span className='text-xs text-gray-400'>Disponivel apos autenticacao</span>
                  </div>
                </div>
                <div className='flex items-center gap-3 rounded-md bg-white/[0.06] px-3 py-3'>
                  <span className='flex h-9 w-9 items-center justify-center rounded-md bg-warning/15 text-warning'>
                    <MdInventory2 size={20} />
                  </span>
                  <div>
                    <span className='block text-sm font-bold text-gray-100'>Produtos</span>
                    <span className='text-xs text-gray-400'>Dados ocultos nesta tela</span>
                  </div>
                </div>
                <div className='h-2 overflow-hidden rounded-full bg-white/10'>
                  <div className='h-full w-2/3 rounded-full bg-primary' />
                </div>
              </div>
            </div>
          </div>

          <p className='text-xs text-gray-400'>Acesso restrito a usuarios autorizados.</p>
        </section>

        <form onSubmit={handleSubmit(onSubmit)} className='flex min-h-[580px] w-full flex-col justify-center gap-6 p-6 sm:p-10'>
          <div className='flex items-center gap-3 lg:hidden'>
            <Image alt='Control' src='/images/logo.png' width={52} height={52} />
            <div>
              <span className='text-xl font-bold text-primary'>Control</span>
              <p className='text-xs text-gray-500'>Painel operacional</p>
            </div>
          </div>

          <div>
            <span className='text-xs font-bold uppercase tracking-[0.16em] text-primary'>Acesso seguro</span>
            <h2 className='mt-2 text-3xl font-bold text-gray-950'>Entre na sua conta</h2>
            <p className='mt-2 text-sm leading-6 text-gray-500'>Use seu login e senha para abrir o painel.</p>
          </div>

          <div className='flex flex-col gap-5'>
            <label className='flex flex-col gap-2'>
              <span className='text-xs font-bold uppercase tracking-wide text-gray-500'>Login</span>
              <span className='flex h-12 items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 transition-colors focus-within:border-primary focus-within:bg-white'>
                <MdOutlinePerson size={21} className='text-gray-400' />
                <input
                  className='h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400'
                  autoComplete='username'
                  placeholder='seu login'
                  {...register('login', { required: true })}
                />
              </span>
            </label>

            <label className='flex flex-col gap-2'>
              <span className='text-xs font-bold uppercase tracking-wide text-gray-500'>Senha</span>
              <span className='flex h-12 items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 transition-colors focus-within:border-primary focus-within:bg-white'>
                <MdLogin size={21} className='text-gray-400' />
                <input
                  className='h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400'
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='current-password'
                  placeholder='sua senha'
                  {...register('password', { required: true })}
                />
                <button
                  type='button'
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  className='flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900'
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? <MdOutlineVisibilityOff size={20} /> : <MdOutlineVisibility size={20} />}
                </button>
              </span>
            </label>
          </div>

          {error && <span className='rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm text-error'>{error}</span>}

          <button
            className='flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-4 font-bold text-white shadow-[0_12px_28px_rgba(204,0,0,0.26)] transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60'
            disabled={loading}
          >
            <MdLogin size={20} />
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <div className='flex items-center justify-between border-t border-gray-100 pt-5 text-xs text-gray-500'>
            <span>Control</span>
            <span>localhost:3000</span>
          </div>
        </form>
      </main>
    </div>
  )
}
