import axios from 'axios'

export async function disableOrActiveClient(id: number, status: boolean) {
  await axios.post(
    `/api/client/status`,
    {},
    {
      params: {
        id,
        status: !status,
      },
    }
  )
}

export async function disableOrActiveProduct(id: number, status: boolean) {
  await axios.post(
    `/api/product/status`,
    {},
    {
      params: {
        id,
        status: !status,
      },
    }
  )
}
