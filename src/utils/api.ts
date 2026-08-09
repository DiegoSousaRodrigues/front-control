import axios from 'axios'
import https from 'https'

const agent = new https.Agent({
  secureProtocol: 'TLSv1_2_method',
})

export const apiControl = axios.create({
  baseURL: 'http://localhost:3001/',
  httpsAgent: agent,
})
