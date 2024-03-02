const { headers } = require('./constant')
const http = require('http')

/**
 * @description handler in 處理 response 的 Module
 * @param {typeof http.IncomingMessage} res
 * @param {number} statusCode
 * @param {unknown} content
 */
const resHandler = (res, statusCode, content) => {
  res.writeHeader(statusCode, headers)
  if (!!content) {
    const detailContent =
      statusCode === 200
        ? {
            status: 'success',
            data: content,
          }
        : { status: 'false', message: content }
    res.write(JSON.stringify(detailContent))
  }
  res.end()
}

/**
 * @description handler in 專門處理錯誤的 Module
 * @param {typeof http.IncomingMessage} res
 * @param {Error} error
 */
const errorHandler = (res, error) => {
  const { inValidJSON, withoutTitle, notFound, idNotExisted } = errorMap
  const { message } = error

  let resMessage = ''
  let errorCode = 400

  if (message === inValidJSON.message) {
    resMessage = inValidJSON.resMessage
  } else if (message === withoutTitle.message) {
    resMessage = withoutTitle.resMessage
  } else if (message === notFound.message) {
    resMessage = notFound.resMessage
  } else if (message === idNotExisted.message) {
    resMessage = idNotExisted.resMessage
  } else {
    errorCode = 404
    resMessage = 'undefined Error'
  }

  resHandler(res, errorCode, resMessage)
}

module.exports = {
  errorHandler,
  resHandler
}
