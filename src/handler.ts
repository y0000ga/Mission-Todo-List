import { headers, errorMap } from './constant'
import { ErrorCode, TErrorHandler, TResHandler } from './type'

export const resHandler = ({ res, statusCode, content }: TResHandler) => {
  res.writeHead(statusCode, headers)
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

export const errorHandler = ({ res, error }: TErrorHandler) => {
  const { invalidJSON, withoutTitle, notFound, idNotExisted } = errorMap
  const { message } = error

  let resMessage = ''
  let errorCode = ErrorCode.badRequest

  if (message === invalidJSON.message) {
    resMessage = invalidJSON.resMessage
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

  resHandler({ res, statusCode: errorCode, content: resMessage })
}
