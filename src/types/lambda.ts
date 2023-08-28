import { Context } from 'aws-lambda';
import { HandlerLambda } from 'middy';

export declare class AppError extends Error {
  message: string;
  code: number;
  langKey: string;
  constructor(message: string, code?: number, langKey?: string);
}

export interface HandlerLambdaExtended<
  T = any,
  V = any,
  C extends Context = Context
> extends HandlerLambda<T, V, C> {
  error: Error | AppError;
}
