#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { NetworkStack } from '../lib/network-stack'
import { DatabaseStack } from '../lib/database-stack'
import { ApiStack } from '../lib/api-stack'
import { FrontendStack } from '../lib/frontend-stack'

const app = new cdk.App()

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION ?? 'eu-west-1',
}

const network = new NetworkStack(app, 'RgmNetwork', { env })

const database = new DatabaseStack(app, 'RgmDatabase', {
  env,
  vpc: network.vpc,
  dbSecurityGroup: network.dbSecurityGroup,
})

const api = new ApiStack(app, 'RgmApi', {
  env,
  vpc: network.vpc,
  apiSecurityGroup: network.apiSecurityGroup,
  dbSecurityGroup: network.dbSecurityGroup,
  dbEndpoint: database.dbEndpoint,
  dbPort: database.dbPort,
  dbName: database.dbName,
  dbSecret: database.dbSecret,
})

new FrontendStack(app, 'RgmFrontend', {
  env,
  apiLoadBalancer: api.loadBalancer,
})

app.synth()
