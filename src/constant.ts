export const headers = {
  'Access-Control-Allow-Headers':
    'Content-Type, Authorization, Content-Length, X-Requested-With',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS, DELETE',
  'Content-Type': 'application/json',
}

export const errorMap = {
  invalidJSON: {
    message: 'Unexpected end of JSON input',
    resMessage: '格式錯誤',
  },
  withoutTitle: {
    message: 'title 欄位錯誤',
    resMessage: 'title 欄位錯誤',
  },
  notFound: {
    message: 'Not Found',
    resMessage: 'Not Found',
  },
  idNotExisted: {
    message: '該 id 不存在',
    resMessage: '該 id 不存在',
  },
}

export const requestMap = {
  getAll: 'getAll',
  add: 'add',
  deleteAll: 'deleteAll',
  delete: 'delete',
  option: 'option',
  edit:'edit'
}