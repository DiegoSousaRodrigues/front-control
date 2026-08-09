import axios from 'axios'
import https from 'https'
import { getApiControlBaseUrl } from './apiBaseUrl'

const agent = new https.Agent({
  secureProtocol: 'TLSv1_2_method',
})

export const apiControl = axios.create({
  baseURL: `${getApiControlBaseUrl()}/`,
  httpsAgent: agent,
})
