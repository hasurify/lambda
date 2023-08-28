import { APIGatewayProxyResult } from 'aws-lambda';
import { AppError, HandlerLambdaExtended } from '../types/lambda';
import { APIGatewayEventExtended } from '../types';
import { sendErrorNotification } from '../services';

export type TResponseHeader = {
  [header: string]: boolean | number | string;
};

export function getResponse<T>(
  body: T,
  statusCode: number = 200,
  headers?: TResponseHeader,
  isBase64Encoded?: boolean | undefined
): APIGatewayProxyResult {
  return {
    statusCode,
    headers,
    isBase64Encoded,
    body: JSON.stringify(body),
  };
}

export function handleResponseError() {
  return (
    handler: HandlerLambdaExtended<APIGatewayEventExtended>,
    next: (error?: any) => void
  ): void => {
    if (handler.error) {
      console.log('Response error handling', JSON.stringify(handler.error));

      const appError = handler.error as AppError;
      const message = appError?.message || 'Unknown error';

      // Send slack notification
      if (process.env.SLACK_WEBHOOK_URL) {
        sendErrorNotification(
          handler.context.functionName,
          JSON.stringify(handler.event.body),
          message
        ).catch(e => {
          console.error(e);
        });
      }

      // Response error
      const body = {
        message,
        code: appError?.code || 0,
        langKey: appError?.langKey || '',
      };
      handler.response = getResponse(body, 500);
    }
    next();
  };
}
