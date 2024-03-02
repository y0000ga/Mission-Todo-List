import http from 'http'
import { requestMap } from './constant'
import { TMethod } from './type'

export const requestCondition = (req: http.IncomingMessage) => {
  if (!req.url) return

  if (req.url === '/todos') {
    if (req.method === TMethod.GET) {
      return requestMap.getAll
    } else if (req.method === TMethod.POST) {
      return requestMap.add
    } else if (req.method === TMethod.DELETE) {
      return requestMap.deleteAll
    }
  }

  if (req.url.startsWith('/todos/') && req.url.split('/').length === 3) {
    if (req.method === TMethod.DELETE) {
      return requestMap.delete
    } else if (req.method === TMethod.PATCH) {
      return requestMap.edit
    }
  }

  if (req.method === TMethod.OPTIONS) {
    return requestMap.option
  }
}
