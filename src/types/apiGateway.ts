import { APIGatewayEvent } from 'aws-lambda';

export type APIGatewayEventExtended = APIGatewayEvent & {
  body: any;
};
