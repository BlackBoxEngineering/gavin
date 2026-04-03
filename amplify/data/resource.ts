import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  ContactSubmission: a
    .model({
      name: a.string().required(),
      company: a.string(),
      email: a.string().required(),
      phone: a.string(),
      message: a.string().required(),
      read: a.boolean().default(false),
    })
    .authorization((allow) => [
      allow.guest().to(['create']),
      allow.group('admin'),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
