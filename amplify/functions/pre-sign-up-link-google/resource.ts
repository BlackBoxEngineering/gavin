import { defineFunction } from '@aws-amplify/backend';

export const preSignUpLinkGoogle = defineFunction({
  name: 'pre-sign-up-link-google',
  resourceGroupName: 'auth',
  timeoutSeconds: 30,
});
