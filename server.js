const http = require('http')
const { v4: uuidV4 } = require('uuid')
const errorHandler = require('./errorHandler')
const { headers, errorMap, requestMap } = require('./constant')
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
    res.writeHeader(200, headers)
    res.write(
      JSON.stringify({
        status: 'success',
        data: todos,
      })
    )
    res.end()
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
          res.writeHeader(200, headers)
          res.write(
            JSON.stringify({
              status: 'success',
              data: todo,
            })
          )
          res.end()
        } else {
          throw Error(errorMap.withoutTitle.message)
        }
      } catch (error) {
        errorHandler(res, error)
      }
    })
  } else if (condition === requestMap.deleteAll) {
    res.writeHeader(200, headers)
    todos.length = 0
    res.write(
      JSON.stringify({
        status: 'success',
        data: todos,
      })
    )
    res.end()
  } else if (condition === requestMap.delete) {
    try {
      const id = req.url.split('/').pop()
      const idx = todos.findIndex((todo) => todo.id === id)
      if (idx !== -1) {
        todos.splice(idx, 1)
        res.writeHeader(200, headers)
        res.write(
          JSON.stringify({
            status: 'success',
            data: todos,
          })
        )
        res.end()
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
        res.writeHeader(200, headers)
        res.write(
          JSON.stringify({
            status: 'success',
            data: todo,
          })
        )
        res.end()
      } catch (error) {
        errorHandler(res, error)
      }
    })
  } else if (condition === requestMap.option) {
    res.writeHeader(200, headers)
    res.end()
  } else {
    errorHandler(res, Error(errorMap.notFound.message))
  }
}

const server = http.createServer(requestListener)

server.listen(process.env.PORT || 3005)
