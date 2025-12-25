# Security & Privacy Notice

## Overview
AI Unlock Gallery is designed with security and privacy as top priorities, especially given the sensitive nature of NSFW content.

## Security Measures Implemented

### 1. Authentication & Authorization
- ✅ **Clerk Authentication**: Industry-standard authentication provider
- ✅ **Protected Routes**: All API routes require authentication
- ✅ **User Isolation**: Gallery images are strictly user-specific
- ✅ **Server-side API Keys**: AI and payment keys never exposed to client

### 2. Age Verification
- ✅ **Age Gate**: Explicit 18+ verification before accessing content
- ✅ **Clear Warnings**: Multiple content warnings throughout the app
- ✅ **Exit Option**: Easy exit for users who shouldn't access content

### 3. Data Privacy
- ✅ **Private Galleries**: Each user can only access their own images
- ✅ **Encrypted Database**: MongoDB connections should use TLS/SSL
- ✅ **No Image Sharing**: No public gallery or sharing features
- ✅ **Secure Sessions**: Clerk handles session management securely

### 4. Payment Security
- ✅ **Stripe Integration**: PCI-compliant payment processing
- ✅ **Webhook Verification**: Stripe webhooks validated with signatures
- ✅ **No Stored Payment Info**: Stripe handles all payment data
- ✅ **Transaction Logging**: Complete audit trail of gem transactions

### 5. API Security
- ✅ **Server-Only Calls**: All AI generation happens server-side
- ✅ **Rate Limiting**: Consider adding rate limiting for production
- ✅ **Input Validation**: All user inputs validated
- ✅ **Error Handling**: Sensitive errors not exposed to client

### 6. Content Moderation
- ⚠️ **User Responsibility**: Users responsible for their prompts
- ⚠️ **AI Provider TOS**: Must comply with Novita AI terms
- ⚠️ **Legal Compliance**: Ensure compliance with local laws

## Recommended Additional Security Measures

### For Production Deployment

1. **Environment Variables**
   - Use strong, unique secrets for all services
   - Never commit `.env` files
   - Rotate keys regularly

2. **Database Security**
   - Enable MongoDB authentication
   - Use connection string encryption
   - Enable audit logging
   - Regular backups

3. **Rate Limiting**
   - Add rate limiting to API routes
   - Prevent abuse of image generation
   - Protect against DDoS

4. **Content Monitoring**
   - Log all generated prompts (hashed)
   - Monitor for abuse
   - Implement reporting system

5. **HTTPS Only**
   - Force HTTPS in production
   - Use secure cookies
   - Enable HSTS headers

6. **Legal Compliance**
   - Terms of Service
   - Privacy Policy
   - DMCA/Copyright policy
   - Age verification records

7. **Data Retention**
   - Define retention policies
   - Allow user data deletion
   - GDPR compliance tools

## Privacy Policy Requirements

### User Data Collected
- Email address (via Clerk)
- Generated image prompts
- Payment information (via Stripe)
- Gallery images (stored URLs)

### Data Usage
- Authentication only
- Service provision
- Payment processing
- No data selling or sharing

### User Rights
- Access their data
- Delete their account
- Export their data
- Opt-out of marketing

## Incident Response

### Security Breach Protocol
1. Immediately revoke compromised keys
2. Notify affected users
3. Document the incident
4. Implement fixes
5. Review and improve security

### Reporting Security Issues
- Create a security contact email
- Responsible disclosure policy
- Bug bounty program (optional)

## Compliance Checklist

- [ ] GDPR compliance (if serving EU users)
- [ ] CCPA compliance (if serving CA users)
- [ ] 18 U.S.C. § 2257 (if applicable)
- [ ] Payment processor adult content policies
- [ ] AI provider terms of service
- [ ] Local obscenity laws

## Monitoring & Logging

### What to Log
- Authentication attempts
- Image generation requests
- Payment transactions
- API errors
- Security events

### What NOT to Log
- User passwords
- Full payment details
- Generated images (unless required)
- Personal identifying information

## Best Practices

1. **Regular Updates**
   - Keep dependencies updated
   - Monitor security advisories
   - Patch vulnerabilities promptly

2. **Code Reviews**
   - Security-focused code reviews
   - Automated security scanning
   - Penetration testing

3. **User Education**
   - Clear privacy policy
   - Transparent data usage
   - Security best practices

4. **Access Control**
   - Principle of least privilege
   - Role-based access control
   - Multi-factor authentication for admins

## Contact

For security concerns or to report vulnerabilities, please contact the repository maintainer through GitHub issues (mark as security-related).

---

**Last Updated**: 2025-12-25
**Version**: 1.0.0
