import { SecretValue, Stack, StackProps } from "aws-cdk-lib";
import {
  BuildSpec,
  LinuxBuildImage,
  PipelineProject,
} from "aws-cdk-lib/aws-codebuild";
import { Artifact, Pipeline } from "aws-cdk-lib/aws-codepipeline";
import {
  CodeBuildAction,
  GitHubSourceAction,
} from "aws-cdk-lib/aws-codepipeline-actions";
import { Construct } from "constructs";

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create the code pipeline
    const pipeline = new Pipeline(this, "Pipeline", {
      pipelineName: "Code Pipeline Demo",
      crossAccountKeys: false,
    });

    // Create the artifact destination for source stage
    const cdkSourceOutput = new Artifact("CdkSourceOutput");

    // Create Source Stage for the code pipeline
    pipeline.addStage({
      stageName: "Source",
      actions: [
        new GitHubSourceAction({
          owner: "Madan007",
          repo: "aws-code-pipeline-demo",
          branch: "main",
          actionName: "PipelineSource",
          oauthToken: SecretValue.unsafePlainText(
            "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"
          ),
          output: cdkSourceOutput,
        }),
      ],
    });

    // Create the artifact destination for code build stage
    const cdkBuildOutput = new Artifact("CdkBuildOutput");

    // Create Code build Stage for the code pipeline
    pipeline.addStage({
      stageName: "Build",
      actions: [
        new CodeBuildAction({
          actionName: "PipelineBuild",
          input: cdkSourceOutput,
          outputs: [cdkBuildOutput],
          project: new PipelineProject(this, "BuildProject", {
            environment: {
              buildImage: LinuxBuildImage.STANDARD_5_0,
            },
            buildSpec: BuildSpec.fromSourceFilename(
              "build-specs/cdk-build-spec.yml"
            ),
          }),
        }),
      ],
    });
  }
}
