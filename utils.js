const http = require('http')
const { requestMap } = require('./constant')

/**
 * @param {typeof http.IncomingMessage} req
 * @return {requestMap[keyof requestMap]}
 */
const requestCondition = (req) => {
  if (req.url === '/todos' && req.method === 'GET') {
    return requestMap.getAll
  }
  if (req.url === '/todos' && req.method === 'POST') {
    return requestMap.add
  }
  if (req.url === '/todos' && req.method === 'DELETE') {
    return requestMap.deleteAll
  }
  if (
    req.url.startsWith('/todos/') &&
    req.url.split('/').length === 3 &&
    req.method === 'DELETE'
  ) {
    return requestMap.delete
  }
  if (req.method === 'OPTION') {
    return requestMap.option
  }
  if (
    req.method === 'PATCH' &&
    req.url.startsWith('/todos/') &&
    req.url.split('/').length === 3
  ) {
    return requestMap.edit
  }
}

module.exports = {
  requestCondition,
}
