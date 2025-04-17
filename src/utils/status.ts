import axios from 'axios'
import Router from 'next/router'

export async function disableOrActiveClient(id: number, status: boolean) {
  axios.post(
    `/api/client/status`,
    {},
    {
      params: {
        id,
        status: !status,
      },
    }
  )
  Router.reload()
}
