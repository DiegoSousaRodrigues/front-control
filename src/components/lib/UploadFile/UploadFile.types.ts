/* eslint-disable @typescript-eslint/no-explicit-any */
export type UploadFileProps = {
  label: string
  value?: File | string
  onChange: (value?: File) => void
}
