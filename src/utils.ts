import { requestMap } from './constant'
import http from 'http'

export const requestCondition = (req: http.IncomingMessage) => {

  if (!req.url) return

  if (req.url === '/todos') {
    if (req.method === 'GET') {
      return requestMap.getAll
    } else if (req.method === 'POST') {
      return requestMap.add
    } else if (req.method === 'DELETE') {
      return requestMap.deleteAll
    }
  }

  if (req.url.startsWith('/todos/') && req.url.split('/').length === 3) {
    if (req.method === 'DELETE') {
      return requestMap.delete
    } else if (req.method === 'PATCH') {
      return requestMap.edit
    }
  }

  if (req.method === 'OPTION') {
    return requestMap.option
  }
}
