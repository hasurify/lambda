import {
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  Callback,
  Context,
} from 'aws-lambda';
import middy from 'middy';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import { errorHandler } from './errorHandler';
import { APIGatewayEventExtended } from '../types';

export function getHandler(
  f: (
    event: APIGatewayEventExtended,
    context: Context,
    callback: Callback
  ) => Promise<APIGatewayProxyResult>
) {
  const handler: APIGatewayProxyHandler = middy(f)
    .use(jsonBodyParser())
    .use(httpErrorHandler())
    .use(errorHandler());

  return handler;
}
