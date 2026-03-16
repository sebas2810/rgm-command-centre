import * as cdk from 'aws-cdk-lib'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import { Construct } from 'constructs'

export class NetworkStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc
  public readonly apiSecurityGroup: ec2.SecurityGroup
  public readonly dbSecurityGroup: ec2.SecurityGroup

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // VPC with 2 AZs, public + private subnets
    this.vpc = new ec2.Vpc(this, 'RgmVpc', {
      maxAzs: 2,
      natGateways: 1, // Cost optimization: 1 NAT gateway
      subnetConfiguration: [
        { cidrMask: 24, name: 'Public', subnetType: ec2.SubnetType.PUBLIC },
        { cidrMask: 24, name: 'Private', subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
        { cidrMask: 24, name: 'Isolated', subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      ],
    })

    // API Security Group (ALB + ECS tasks)
    this.apiSecurityGroup = new ec2.SecurityGroup(this, 'ApiSG', {
      vpc: this.vpc,
      description: 'RGM API (ALB + Fargate)',
      allowAllOutbound: true,
    })
    this.apiSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'HTTP from CloudFront')
    this.apiSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), 'HTTPS from CloudFront')

    // Database Security Group
    this.dbSecurityGroup = new ec2.SecurityGroup(this, 'DbSG', {
      vpc: this.vpc,
      description: 'RGM RDS PostgreSQL',
      allowAllOutbound: false,
    })
    this.dbSecurityGroup.addIngressRule(this.apiSecurityGroup, ec2.Port.tcp(5432), 'Postgres from API')
  }
}
