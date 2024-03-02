import http from 'http'

export enum ErrorCode {
  ok = 200,
  badRequest = 400,
  notFound = 404,
}

export type TResponse = http.ServerResponse<http.IncomingMessage> & {
  req: http.IncomingMessage
}

export type TResHandler = {
  res: TResponse
  statusCode: ErrorCode
  content?: unknown
}

export type TErrorHandler = {
  res: TResponse
  error: Error
}

export type TTodoList = { title: string; id: string }[]

export type TRequestListener = http.RequestListener<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>
