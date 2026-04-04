import {
  AdminLinkProviderForUserCommand,
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from '@aws-sdk/client-cognito-identity-provider';

type PreSignUpEvent = {
  triggerSource: string;
  userPoolId: string;
  userName: string;
  request: {
    userAttributes?: Record<string, string>;
  };
  response: {
    autoConfirmUser?: boolean;
    autoVerifyEmail?: boolean;
    autoVerifyPhone?: boolean;
  };
};

const client = new CognitoIdentityProviderClient({});

const isFederatedSignUp = (triggerSource: string): boolean =>
  triggerSource === 'PreSignUp_ExternalProvider';

const getEmail = (event: PreSignUpEvent): string =>
  String(event.request.userAttributes?.email || '').trim().toLowerCase();

const getProviderIdentity = (
  userName: string,
): { providerName: string; providerSubject: string } | null => {
  const splitIndex = userName.indexOf('_');
  if (splitIndex < 1) return null;
  const rawProviderName = userName.slice(0, splitIndex);
  const providerSubject = userName.slice(splitIndex + 1);
  if (!providerSubject) return null;
  return {
    providerName: rawProviderName.charAt(0).toUpperCase() + rawProviderName.slice(1).toLowerCase(),
    providerSubject,
  };
};

const isSameFederatedUser = (username: string, providerSubject: string): boolean => {
  const splitIndex = username.indexOf('_');
  if (splitIndex < 0) return false;
  return username.slice(splitIndex + 1) === providerSubject;
};

const isFederatedUsername = (username: string): boolean => {
  // Cognito social users are emitted as "<provider>_<subject>" (e.g. google_123...).
  const splitIndex = username.indexOf('_');
  if (splitIndex <= 0) return false;
  const providerPrefix = username.slice(0, splitIndex).toLowerCase();
  return ['google', 'facebook', 'loginwithamazon', 'signinwithapple'].includes(providerPrefix);
};

export const handler = async (event: PreSignUpEvent): Promise<PreSignUpEvent> => {
  if (!isFederatedSignUp(event.triggerSource)) return event;

  const email = getEmail(event);
  const providerIdentity = getProviderIdentity(event.userName);

  if (!email || !providerIdentity) return event;

  try {
    const list = await client.send(
      new ListUsersCommand({
        UserPoolId: event.userPoolId,
        Filter: `email = "${email}"`,
        Limit: 10,
      }),
    );

    const target = (list.Users || []).find((user: { Username?: string }) => {
      const username = user.Username || '';
      if (!username) return false;
      if (isSameFederatedUser(username, providerIdentity.providerSubject)) return false;
      if (isFederatedUsername(username)) return false;
      return true;
    });

    const destinationUsername = target?.Username;
    if (!destinationUsername) return event;

    await client.send(
      new AdminLinkProviderForUserCommand({
        UserPoolId: event.userPoolId,
        DestinationUser: {
          ProviderName: 'Cognito',
          ProviderAttributeValue: destinationUsername,
        },
        SourceUser: {
          ProviderName: providerIdentity.providerName,
          ProviderAttributeName: 'Cognito_Subject',
          ProviderAttributeValue: providerIdentity.providerSubject,
        },
      }),
    );

    console.log(
      JSON.stringify({
        action: 'linked_federated_user',
        email,
        providerName: providerIdentity.providerName,
        destinationUsername,
      }),
    );
  } catch (error) {
    const message = (error as { name?: string; message?: string })?.message || 'unknown error';
    const name = (error as { name?: string })?.name || 'Error';
    console.error(JSON.stringify({ action: 'link_failed', email, name, message }));
  }

  return event;
};
