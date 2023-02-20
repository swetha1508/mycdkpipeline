import { Construct, SecretValue, Stack, StackProps } from '@aws-cdk/core';
import { CodePipeline, CodePipelineSource, ShellStep } from "@aws-cdk/pipelines";
import { OtherApiStage } from './stages/other-api-stage';
import { AmplifyStage } from './stages/amplify-stage';
import * as cdk from '@aws-cdk/core'
//import { App, Stack } from 'aws-cdk-lib';

/**
 * The stack that defines the application pipeline
 */
 export class MyPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      // The pipeline name
      pipelineName: 'MyCdkPipeline',

       // How it will be built and synthesized
       synth: new ShellStep('Synth', {
         // Where the source can be found
         input: CodePipelineSource.gitHub('swetha1508/mycdkpipeline', 'main'),
         
         // Install dependencies, build and run cdk synth
         commands: [
           'npm ci',
           'npm run build',
           'npx cdk synth'
         ],
       }),
    });
    // This is where we add the application stages
    pipeline.addStage(new AmplifyStage(this, "amplifyStage",{
 env: {
  account: cdk.Stack.of(this).account,
  region: cdk.Stack.of(this).region
}}))
    pipeline.addStage(new OtherApiStage(this, "otherApiStage"))
  }
}
