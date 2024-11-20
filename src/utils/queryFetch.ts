/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryFunctionContext } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'

export async function queryFetch<T = Record<string, any>>({ pageParam, queryKey, signal }: QueryFunctionContext) {
  const [url, params] = queryKey
  const _params = {
    ...(params as Record<string, any>),
    page: pageParam ? pageParam : ((params as Record<string, any>) || {})?.page,
  }

  try {
    return (
      await axios.get<T>(`/api/${url}`, {
        params: _params,
        signal,
      })
    ).data
  } catch (e: any) {
    if (e.response.status !== 403) {
      const error: AxiosError<{ message: string; time: string }> = e
      console.log(error)
    }
    throw new Error(e.response.data)
  }
}
