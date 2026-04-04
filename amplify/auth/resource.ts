import { defineAuth, secret } from '@aws-amplify/backend';
import { preSignUpLinkGoogle } from '../functions/pre-sign-up-link-google/resource';

export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: secret('GOOGLE_CLIENT_ID'),
        clientSecret: secret('GOOGLE_CLIENT_SECRET'),
        scopes: ['email', 'openid', 'profile'],
      },
      callbackUrls: [
        'https://gavinwoodhouse.com/admin',
        'http://localhost:3000/admin',
      ],
      logoutUrls: [
        'https://gavinwoodhouse.com',
        'http://localhost:3000',
      ],
    },
  },
  triggers: {
    preSignUp: preSignUpLinkGoogle,
  },
  accountRecovery: 'EMAIL_ONLY',
});
