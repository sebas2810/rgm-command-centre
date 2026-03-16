import * as cdk from 'aws-cdk-lib'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as ecs from 'aws-cdk-lib/aws-ecs'
import * as ecr from 'aws-cdk-lib/aws-ecr'
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2'
import * as rds from 'aws-cdk-lib/aws-rds'
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager'
import * as logs from 'aws-cdk-lib/aws-logs'
import { Construct } from 'constructs'

interface ApiStackProps extends cdk.StackProps {
  vpc: ec2.Vpc
  apiSecurityGroup: ec2.SecurityGroup
  dbSecurityGroup: ec2.SecurityGroup
  dbEndpoint: string
  dbPort: string
  dbName: string
  dbSecret: rds.DatabaseSecret
}

export class ApiStack extends cdk.Stack {
  public readonly loadBalancer: elbv2.ApplicationLoadBalancer

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props)

    // Anthropic API Key (must be created manually in Secrets Manager first)
    const anthropicSecret = secretsmanager.Secret.fromSecretNameV2(
      this, 'AnthropicKey', 'rgm/anthropic-api-key'
    )

    // ECR Repository for CI/CD image pushes
    const repo = new ecr.Repository(this, 'ApiRepo', {
      repositoryName: 'rgm-command-centre',
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      lifecycleRules: [
        { maxImageCount: 10, description: 'Keep last 10 images' },
      ],
    })

    // ECS Cluster
    const cluster = new ecs.Cluster(this, 'RgmCluster', {
      vpc: props.vpc,
      containerInsights: true,
    })

    // Task Definition
    const taskDef = new ecs.FargateTaskDefinition(this, 'ApiTaskDef', {
      memoryLimitMiB: 1024,
      cpu: 512,
    })

    // Use ECR image (CI/CD pushes with :latest tag)
    const container = taskDef.addContainer('api', {
      image: ecs.ContainerImage.fromEcrRepository(repo, 'latest'),
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: 'rgm-api',
        logRetention: logs.RetentionDays.TWO_WEEKS,
      }),
      environment: {
        NODE_ENV: 'production',
        PORT: '3001',
        DB_HOST: props.dbEndpoint,
        DB_PORT: props.dbPort,
        DB_NAME: props.dbName,
      },
      secrets: {
        DB_USERNAME: ecs.Secret.fromSecretsManager(props.dbSecret, 'username'),
        DB_PASSWORD: ecs.Secret.fromSecretsManager(props.dbSecret, 'password'),
        ANTHROPIC_API_KEY: ecs.Secret.fromSecretsManager(anthropicSecret),
      },
      healthCheck: {
        command: ['CMD-SHELL', 'curl -f http://localhost:3001/api/health || exit 1'],
        interval: cdk.Duration.seconds(30),
        timeout: cdk.Duration.seconds(5),
        retries: 3,
      },
    })
    container.addPortMappings({ containerPort: 3001 })

    // ALB
    this.loadBalancer = new elbv2.ApplicationLoadBalancer(this, 'ApiAlb', {
      vpc: props.vpc,
      internetFacing: true,
      securityGroup: props.apiSecurityGroup,
    })

    const listener = this.loadBalancer.addListener('HttpListener', {
      port: 80,
    })

    // Fargate Service
    const service = new ecs.FargateService(this, 'ApiService', {
      cluster,
      taskDefinition: taskDef,
      desiredCount: 1,
      assignPublicIp: false,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      securityGroups: [props.apiSecurityGroup],
    })

    listener.addTargets('ApiTarget', {
      port: 3001,
      targets: [service],
      healthCheck: {
        path: '/api/health',
        interval: cdk.Duration.seconds(30),
        healthyThresholdCount: 2,
        unhealthyThresholdCount: 3,
      },
      // SSE streaming: increase idle timeout
      deregistrationDelay: cdk.Duration.seconds(30),
    })

    // Grant RDS access
    props.dbSecret.grantRead(taskDef.taskRole)
    anthropicSecret.grantRead(taskDef.taskRole)

    // Outputs
    new cdk.CfnOutput(this, 'AlbDnsName', {
      value: this.loadBalancer.loadBalancerDnsName,
    })
    new cdk.CfnOutput(this, 'EcrRepoUri', {
      value: repo.repositoryUri,
    })
    new cdk.CfnOutput(this, 'EcsClusterName', {
      value: cluster.clusterName,
    })
    new cdk.CfnOutput(this, 'EcsServiceName', {
      value: service.serviceName,
    })
  }
}
