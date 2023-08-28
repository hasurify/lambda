import { aws_apigateway as apigw } from 'aws-cdk-lib';

export function addMethod(
  type: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS',
  resource: apigw.Resource,
  lambdaIntegration: apigw.LambdaIntegration
) {
  return resource.addMethod(type, lambdaIntegration, {
    apiKeyRequired: false,
    methodResponses: [
      {
        statusCode: '200',
        responseParameters: {
          'method.response.header.Content-Type': true,
          'method.response.header.Access-Control-Allow-Headers': true,
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
        },
      },
      {
        statusCode: '400',
        responseParameters: {
          'method.response.header.Content-Type': true,
          'method.response.header.Access-Control-Allow-Headers': true,
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
        },
      },
    ],
  });
}
