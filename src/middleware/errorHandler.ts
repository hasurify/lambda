import { APIGatewayProxyResult } from 'aws-lambda';
import { HandlerLambda, MiddlewareObject } from 'middy';
import { APIGatewayEventExtended } from '../types';
import { appLogger } from '../utils';
import { handleResponseError } from './response';

export function errorHandler(): MiddlewareObject<
  APIGatewayEventExtended,
  APIGatewayProxyResult
> {
  return {
    before: async (
      handler: HandlerLambda<APIGatewayEventExtended>
    ): Promise<void> => {
      const host = handler.event.headers?.Host;
      const hostWithoutPort = host?.split(':')[0] || '';
      appLogger.warn('Remote host: ' + hostWithoutPort);
    },
    after: handleResponseError(),
    onError: handleResponseError(),
  };
}
