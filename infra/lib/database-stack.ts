import * as cdk from 'aws-cdk-lib'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as rds from 'aws-cdk-lib/aws-rds'
import { Construct } from 'constructs'

interface DatabaseStackProps extends cdk.StackProps {
  vpc: ec2.Vpc
  dbSecurityGroup: ec2.SecurityGroup
}

export class DatabaseStack extends cdk.Stack {
  public readonly dbEndpoint: string
  public readonly dbPort: string
  public readonly dbName: string
  public readonly dbSecret: rds.DatabaseSecret

  constructor(scope: Construct, id: string, props: DatabaseStackProps) {
    super(scope, id, props)

    const dbName = 'rgm_command_centre'

    // Database credentials (auto-generated, stored in Secrets Manager)
    this.dbSecret = new rds.DatabaseSecret(this, 'RgmDbSecret', {
      username: 'rgm_admin',
    })

    // RDS PostgreSQL instance (t4g.micro for demo tier)
    const instance = new rds.DatabaseInstance(this, 'RgmDb', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_16,
      }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T4G, ec2.InstanceSize.MICRO),
      vpc: props.vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      securityGroups: [props.dbSecurityGroup],
      credentials: rds.Credentials.fromSecret(this.dbSecret),
      databaseName: dbName,
      allocatedStorage: 20,
      maxAllocatedStorage: 50,
      storageType: rds.StorageType.GP3,
      multiAz: false, // Demo — no need for multi-AZ
      backupRetention: cdk.Duration.days(7),
      deletionProtection: false, // Demo — allow easy cleanup
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    })

    this.dbEndpoint = instance.dbInstanceEndpointAddress
    this.dbPort = instance.dbInstanceEndpointPort
    this.dbName = dbName

    // Outputs
    new cdk.CfnOutput(this, 'DbEndpoint', { value: this.dbEndpoint })
    new cdk.CfnOutput(this, 'DbSecretArn', { value: this.dbSecret.secretArn })
  }
}
