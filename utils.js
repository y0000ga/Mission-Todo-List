const http = require('http')
const { requestMap } = require('./constant')

/**
 * @param {typeof http.IncomingMessage} req
 * @return {requestMap[keyof requestMap]}
 */
const requestCondition = (req) => {
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

module.exports = {
  requestCondition,
}
