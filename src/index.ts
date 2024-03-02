import http from 'http'
import { errorHandler, resHandler } from './handler'
import { errorMap, requestMap } from './constant'
import { requestCondition } from './utils'
import { v4 as uuidV4 } from 'uuid'
import { TRequestListener, TTodoList } from './type'

const todos: TTodoList = []

const requestListener: TRequestListener = (req, res) => {
  let body = ''

  req.on('data', (chunk) => {
    body += chunk
  })

  const condition = requestCondition(req)

  if (condition === requestMap.getAll) {
    resHandler({ res, statusCode: 200, content: todos })
  } else if (condition === requestMap.add) {
    req.on('end', () => {
      try {
        const { title } = JSON.parse(body)
        if (title) {
          const todo = {
            title,
            id: uuidV4(),
          }
          todos.push(todo)
          resHandler({ res, statusCode: 200, content: todo })
        } else {
          throw Error(errorMap.withoutTitle.message)
        }
      } catch (error) {
        errorHandler({ res, error: error as Error })
      }
    })
  } else if (condition === requestMap.deleteAll) {
    todos.length = 0
    resHandler({ res, statusCode: 200, content: todos })
  } else if (condition === requestMap.delete) {
    try {
      const id = (req.url || '').split('/').pop()
      const idx = todos.findIndex((todo) => todo.id === id)
      if (idx !== -1) {
        todos.splice(idx, 1)
        resHandler({ res, statusCode: 200, content: todos })
      } else {
        throw Error(errorMap.idNotExisted.message)
      }
    } catch (error) {
      errorHandler({ res, error: error as Error })
    }
  } else if (condition === requestMap.edit) {
    req.on('end', () => {
      try {
        const { title } = JSON.parse(body)

        if (!title) {
          throw Error(errorMap.withoutTitle.message)
        }

        const id = (req.url || '').split('/').pop()
        const idx = todos.findIndex((todo) => todo.id === id)

        if (idx === -1) {
          throw Error(errorMap.idNotExisted.message)
        }

        todos[`${idx}`] = { ...todos[`${idx}`], title }

        const todo = {
          title,
          id,
        }

        resHandler({ res, statusCode: 200, content: todo })
      } catch (error) {
        errorHandler({ res, error: error as Error })
      }
    })
  } else if (condition === requestMap.option) {
    resHandler({ res, statusCode: 200 })
  } else {
    errorHandler({ res, error: Error(errorMap.notFound.message) })
  }
}

const server = http.createServer(requestListener)

export default server
