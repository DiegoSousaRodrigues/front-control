/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryFunctionContext } from '@tanstack/react-query'
import axios from 'axios'

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
  } catch (e) {
    if (axios.isCancel(e)) {
      throw e
    }

    if (axios.isAxiosError(e)) {
      const message =
        typeof e.response?.data === 'string'
          ? e.response.data
          : e.response?.data?.error || e.response?.data?.erro || e.message || 'Erro ao buscar dados'

      throw new Error(message)
    }

    throw new Error('Erro inesperado ao buscar dados')
  }
}
