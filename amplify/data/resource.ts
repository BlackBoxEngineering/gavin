import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const ADMIN_GROUP = "gavin-admingroup";

const schema = a.schema({
  UserProfile: a
    .model({
      email: a.string().required(),
      displayName: a.string(),
      role: a.string(),
      profilePictureUrl: a.string(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.groups([ADMIN_GROUP]),
      allow.authenticated().to(["read"]),
    ]),

  Client: a
    .model({
      fullName: a.string().required(),
      email: a.string(),
      phone: a.string(),
      companyName: a.string(),
      source: a.string(), // legacy | referral | website | manual | import
      lifecycle: a.string(), // old | new
      status: a.string(), // lead | active | inactive | archived
      notes: a.string(),
    })
    .authorization((allow) => [
      allow.groups([ADMIN_GROUP]).to(["create", "read", "update", "delete"]),
      allow.authenticated().to(["read"]),
    ]),

  Contact: a
    .model({
      name: a.string().required(),
      email: a.string().required(),
      message: a.string().required(),
    })
    .authorization((allow) => [
      allow.guest().to(["create"]),
      allow.authenticated().to(["create"]),
      allow.groups([ADMIN_GROUP]).to(["read", "delete"]),
    ]),

  SupportMessage: a
    .model({
      userId: a.string().required(),
      fromUserId: a.string().required(),
      fromUserType: a.string().required(), // user | admin
      message: a.string().required(),
      isAdminNote: a.boolean().default(false),
      emailSent: a.boolean().default(false),
      readAt: a.string(),
    })
    .authorization((allow) => [
      allow.authenticated().to(["create", "read"]),
      allow.groups([ADMIN_GROUP]).to(["update", "delete"]),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
