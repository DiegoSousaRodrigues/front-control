/* eslint-disable @typescript-eslint/no-explicit-any */
import { MdUploadFile } from 'react-icons/md'
import { FaTrash } from 'react-icons/fa'
import { UploadFileProps } from './UploadFile.types'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export function UploadFile({ label, value, onChange }: UploadFileProps) {
  const [preview, setPreview] = useState<string>('')

  useEffect(() => {
    if (!value) {
      setPreview('')
      return
    }

    const objectUrl = typeof value === 'string' ? value : URL.createObjectURL(value)
    setPreview(objectUrl)

    return () => {
      if (typeof value !== 'string') URL.revokeObjectURL(objectUrl)
    }
  }, [value])

  function handleOnChange(event: any) {
    const files = event.target.files
    if (files && files[0]) {
      const file = files[0]

      if (!file || !file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.')
      }

      onChange(file)
    }
  }

  function reset() {
    onChange(undefined)
  }

  return (
    <div className='flex flex-col'>
      <span className='text-xs text-primary px-2'>{label}</span>
      {value ? (
        <button type='button' onClick={reset} className='group w-fit relative'>
          <div className='group-hover:flex bg-error opacity-40 w-full h-full absolute rounded-lg hidden items-center justify-center'>
            <FaTrash size={24} className='fill-black' />
          </div>
          <Image className='rounded-lg' src={preview} alt='Preview do arquivo' width={260} height={120} />
        </button>
      ) : (
        <label
          htmlFor='upload-arquivo'
          className='hover:border-primary hover:text-primary flex flex-col items-center justify-center h-[120px] w-[280px] border-2 border-dashed rounded-lg text-gray-500 cursor-pointer'
        >
          <MdUploadFile size={24} />
          <span className='text-sm'>Selecione o arquivo aqui</span>
        </label>
      )}

      <input id='upload-arquivo' onChange={handleOnChange} type='file' className='hidden' />
    </div>
  )
}
