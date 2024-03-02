const http = require('http')
const { v4: uuidV4 } = require('uuid')
const errorHandler = require('./errorHandler')
const resHandler = require('./resHandler')
const { errorMap, requestMap, localPort } = require('./constant')
const { requestCondition } = require('./utils')

/**
 * @type {Array.<{title:string,id:string}>}
 */
const todos = []

/**
 * @param {typeof http.IncomingMessage} req
 * @param {typeof http.ServerResponse} res
 */
const requestListener = (req, res) => {
  let body = ''

  req.on('data', (chunk) => {
    body += chunk
  })

  const condition = requestCondition(req)

  if (condition === requestMap.getAll) {
    resHandler(res, 200, todos)
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
          resHandler(res, 200, todo)
        } else {
          throw Error(errorMap.withoutTitle.message)
        }
      } catch (error) {
        errorHandler(res, error)
      }
    })
  } else if (condition === requestMap.deleteAll) {
    todos.length = 0
    resHandler(res, 200, todos)
  } else if (condition === requestMap.delete) {
    try {
      const id = req.url.split('/').pop()
      const idx = todos.findIndex((todo) => todo.id === id)
      if (idx !== -1) {
        todos.splice(idx, 1)
        resHandler(res, 200, todos)
      } else {
        throw Error(errorMap.idNotExisted.message)
      }
    } catch (error) {
      errorHandler(res, error)
    }
  } else if (condition === requestMap.edit) {
    req.on('end', () => {
      try {
        const { title } = JSON.parse(body)

        if (!title) {
          throw Error(errorMap.withoutTitle.message)
        }

        const id = req.url.split('/').pop()
        const idx = todos.findIndex((todo) => todo.id === id)

        if (idx === -1) {
          throw Error(errorMap.idNotExisted.message)
        }

        todos[`${idx}`] = { ...todos[`${idx}`], title }

        const todo = {
          title,
          id,
        }

        resHandler(res, 200, todo)
      } catch (error) {
        errorHandler(res, error)
      }
    })
  } else if (condition === requestMap.option) {
    resHandler(res, 200)
  } else {
    errorHandler(res, Error(errorMap.notFound.message))
  }
}

const server = http.createServer(requestListener)

server.listen(process.env.PORT || localPort)
