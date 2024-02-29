const { headers, errorMap } = require('./constant')

/**
 * @description handler in 專門處理錯誤的 Module
 * @param {typeof http.IncomingMessage} res
 * @param {Error} error
 */
const errorHandler = (res, error) => {
  const { inValidJSON, withoutTitle, notFound, idNotExisted } = errorMap

  const { message } = error

  res.writeHeader(400, headers)
  let resMessage = ''
  
  if (message === inValidJSON.message) {
    resMessage = inValidJSON.resMessage
  } else if (message === withoutTitle.message) {
    resMessage = withoutTitle.resMessage
  } else if (message === notFound.message) {
    resMessage = notFound.resMessage
  } else if (message === idNotExisted.message) {
    resMessage = idNotExisted.resMessage
  } else {
    resMessage = 'undefined Error'
  }

  res.write(
    JSON.stringify({
      status: 'false',
      message: resMessage,
    })
  )
  res.end()
}

module.exports = errorHandler
