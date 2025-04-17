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

export async function disableOrActiveProduct(id: number, status: boolean) {
  axios.post(
    `/api/product/status`,
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
