/* eslint-disable @typescript-eslint/no-explicit-any */
import { MdUploadFile } from 'react-icons/md'
import { FaTrash } from 'react-icons/fa'
import { UploadFileProps } from './UploadFile.types'
import { useState } from 'react'
import Image from 'next/image'

export function UploadFile({ label, onChange }: UploadFileProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  function handleOnChange(event: any) {
    const files = event.target.files
    if (files && files[0]) {
      const fileName = files[0].name
      const file = files[0]

      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }

      if (file && file.type.startsWith('image/')) {
        setImagePreview(URL.createObjectURL(file))
      } else {
        setImagePreview(null)
        if (file) {
          alert('Por favor, selecione apenas arquivos de imagem.')
        }
      }

      onChange(fileName)
    }
  }

  function reset() {
    onChange('')
    setImagePreview(null)
  }

  return (
    <div className='flex flex-col'>
      <span className='text-xs text-primary px-2'>{label}</span>
      {imagePreview ? (
        <button type='button' onClick={reset} className='group w-fit relative'>
          <div className='group-hover:flex bg-error opacity-40 w-full h-full absolute rounded-lg hidden items-center justify-center'>
            <FaTrash size={24} className='fill-black' />
          </div>
          <Image className='rounded-lg' src={imagePreview} alt='Preview do arquivo' width={260} height={120} />
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
      <button
        className='w-fit border border-primary border-solid text-primary px-4 py-2 rounded-lg'
        type='button'
        onClick={reset}
      >
        Apagar arquivo
      </button>
    </div>
  )
}
