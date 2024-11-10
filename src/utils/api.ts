import axios from 'axios'
import * as AxiosLogger from 'axios-logger'
import https from 'https'

AxiosLogger.setGlobalConfig({
  prefixText: 'Control',
  dateFormat: 'HH:mm:ss',
  method: true,
  url: true,
  params: true,
  data: true,
  status: true,
  headers: true,
})

const agent = new https.Agent({
  secureProtocol: 'TLSv1_2_method',
})

export const apiControl = axios.create({
  baseURL: 'http://localhost:3001/',
  httpsAgent: agent,
})

apiControl.interceptors.request.use(AxiosLogger.requestLogger)
apiControl.interceptors.response.use(AxiosLogger.responseLogger)
