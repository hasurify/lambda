import {
  Stack,
  StackProps,
  aws_lambda as lambda,
  Duration,
  aws_ec2 as ec2,
  aws_iam as iam,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export abstract class BaseLambdaStack extends Stack {
  constructor(
    protected scope: Construct,
    protected id: string,
    protected props?: StackProps
  ) {
    super(scope, id, props);
  }

  public createLambdaFunction(
    context: Construct,
    functionName: string,
    options: {
      config: Record<string, string | number | boolean>;
      environment?: Record<string, string>;
      assetPath: string;
    }
  ): lambda.Function {
    const { config, environment, assetPath } = options;
    const memorySize = Number(config.MEMORY_SIZE || 256);
    const concurrency = Number(config.CONCURRENCY || 10);
    const timeout = Number(config.TIMEOUT || 10);
    const env = config.ENVIRONMENT?.toString() || 'dev';
    const adminSecret = config.ADMIN_SECRET.toString();
    const jwtSecret = config.HASURA_JWT_SECRET.toString();
    const hgeEndpoint = config.HGE_ENDPOINT.toString();
    const vpcName = config.VPC_NAME.toString();
    const region = this.props?.env?.region || config.AWS_REGION;
    const account = this.props?.env?.account || config.AWS_ACCOUNT;
    const apiGatewayRestApiId = config.API_ID;
    // ================================================================= //
    // VPC configuration
    // ================================================================= //
    const vpc = ec2.Vpc.fromLookup(context, 'VPC', {
      vpcName,
    });
    const securityGroup = ec2.SecurityGroup.fromLookupByName(
      context,
      'SG',
      'default',
      vpc
    );

    // ================================================================= //
    // Lambda function
    // ================================================================= //
    const lambdaFunction = new lambda.Function(context, functionName, {
      functionName: functionName,
      description: `The function to handle Service API`,
      runtime: lambda.Runtime.NODEJS_16_X,
      memorySize,
      tracing: lambda.Tracing.ACTIVE,
      reservedConcurrentExecutions: concurrency,
      timeout: Duration.seconds(timeout),
      handler: 'app.handler',
      code: lambda.Code.fromAsset(assetPath, {
        exclude: ['.gitkeep'],
      }),
      environment: {
        ENVIRONMENT: env,
        ADMIN_SECRET: adminSecret,
        HASURA_JWT_SECRET: jwtSecret,
        HGE_ENDPOINT: hgeEndpoint,
        ...environment,
      },
      vpc,
      securityGroups: [securityGroup],
    });

    // ============================================================================= //
    // This permission should be deployed after API Gateway is deployed. Please deploy
    // the API Gateway in the infra repository
    // ============================================================================= //
    lambdaFunction.addPermission(`AllowAPIGwToCallLambda`, {
      action: 'lambda:InvokeFunction',
      sourceArn: `arn:aws:execute-api:${region}:${account}:${apiGatewayRestApiId}/*/*/*`,
      principal: new iam.ServicePrincipal('apigateway.amazonaws.com'),
    });

    return lambdaFunction;
  }
}
