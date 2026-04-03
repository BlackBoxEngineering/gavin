# Backend Architecture

## Region
- us-east-1 (primary for Amplify + SES + Cognito)

## Auth — Cognito + Google OAuth
- Cognito User Pool for admin access
- Google OAuth federated identity (Google Cloud Console app required)
- Initial user: Gavin (single admin)
- Future: client portal area with separate role/group

## Roles / Groups
- `admin` — Gavin, full access to messages dashboard
- `client` — future, scoped access to their own area

## Email — SES
- Domain: gavinwoodhouse.com (in Route 53, same AWS account)
- SES domain verification via Route 53 DNS records (automated)
- Sending address: gavin@gavinwoodhouse.com or noreply@gavinwoodhouse.com
- Notification email: gavin@censinvestments.co.uk
- SES starts in sandbox — production access request needed after first deploy

## Database — DynamoDB via Amplify Gen 2 Data
- Table: ContactSubmission
- Fields: id, name, company, email, phone, message, createdAt, read (boolean)

## Contact Form — current scope
- Fields: Name, Company, Email, Phone (optional), Message
- On submit: save to DynamoDB + send SES notification to Gavin
- Google Maps and additional contact methods to be added later

## Admin Area
- Route: /admin
- Protected by Cognito (redirect to login if unauthenticated)
- Shows all ContactSubmission records, newest first
- Mark as read functionality
- Future: client portal at /portal with role-based access

## Google Integrations (pending)
- Google Search Console: verify gavinwoodhouse.com ownership
- Google Cloud Console: OAuth 2.0 app for Cognito federation
  - Authorised redirect URI: Cognito hosted UI callback URL
  - Scopes: openid, email, profile

## Outstanding Actions
- [ ] Register app in Google Cloud Console, get client ID + secret
- [ ] Request SES production access after first deploy
- [ ] Submit sitemap to Google Search Console
- [ ] Create Cognito admin user for Gavin
