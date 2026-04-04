import { defineBackend } from '@aws-amplify/backend';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Stack } from 'aws-cdk-lib';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { preSignUpLinkGoogle } from './functions/pre-sign-up-link-google/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  preSignUpLinkGoogle,
});

const lambdaStack = Stack.of(backend.preSignUpLinkGoogle.resources.lambda);

backend.preSignUpLinkGoogle.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['cognito-idp:ListUsers', 'cognito-idp:AdminLinkProviderForUser'],
    resources: [`arn:aws:cognito-idp:${lambdaStack.region}:${lambdaStack.account}:userpool/*`],
  }),
);
