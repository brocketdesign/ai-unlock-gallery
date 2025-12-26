# Deployment Guide

This guide covers deploying AI Unlock Gallery to production.

## Prerequisites

Before deploying, ensure you have:
- [ ] Vercel account (or alternative hosting)
- [ ] Clerk account with production keys
- [ ] MongoDB Atlas account (or self-hosted MongoDB)
- [ ] Stripe account with production keys
- [ ] Novita AI API key
- [ ] Custom domain (recommended)

## Environment Setup

### 1. Clerk Setup

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Enable email/password authentication
4. Set age restriction to 18+ (if available)
5. Copy production API keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
6. Configure redirect URLs:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in: `/`
   - After sign-up: `/`

### 2. MongoDB Setup

1. Create a MongoDB Atlas cluster (or use your own)
2. Create a database named `ai-unlock-gallery`
3. Set up database user with read/write permissions
4. Whitelist your deployment IP (or use 0.0.0.0/0 for Vercel)
5. Copy connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-unlock-gallery
   ```

### 3. Stripe Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get your production API keys:
   - `STRIPE_SECRET_KEY` (sk_live_...)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (pk_live_...)
3. Create a webhook endpoint:
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`
   - Copy webhook secret: `STRIPE_WEBHOOK_SECRET`
4. Review and accept adult content policy (if applicable)

### 4. Novita AI Setup

1. Sign up at [Novita AI](https://novita.ai)
2. Purchase credits or set up billing
3. Copy your API key:
   - `NOVITA_API_KEY`
4. Review their NSFW content policy
5. Ensure compliance with their terms

### 5. Environment Variables

Create these environment variables in your hosting platform:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxx
CLERK_SECRET_KEY=sk_live_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-unlock-gallery

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Novita AI
NOVITA_API_KEY=your_production_key
NOVITA_API_URL=https://api.novita.ai/v3/async/txt2img

# App Configuration
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

## Deployment to Vercel

### 1. Initial Setup

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

### 2. Production Deployment

```bash
# Deploy to production
vercel --prod
```

### 3. Configure Domain

1. Go to Vercel dashboard
2. Select your project
3. Settings > Domains
4. Add your custom domain
5. Update DNS records as instructed

### 4. Environment Variables

1. Project Settings > Environment Variables
2. Add all variables from above
3. Set for Production, Preview, and Development as needed

### 5. Build Configuration

Vercel should auto-detect Next.js settings. Verify:
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

## Post-Deployment Checklist

### Testing
- [ ] Test age verification flow
- [ ] Test user registration
- [ ] Test image generation
- [ ] Test mini-games (scratch & puzzle)
- [ ] Test gem purchase flow
- [ ] Test Stripe webhook
- [ ] Test gallery functionality
- [ ] Test mobile responsiveness

### Security
- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] API keys rotated from development
- [ ] Database access restricted
- [ ] Rate limiting configured
- [ ] Error logging enabled

### Legal & Compliance
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Age verification disclaimer
- [ ] DMCA agent registered
- [ ] Cookie consent (if required)
- [ ] GDPR compliance (if EU traffic)

### Monitoring
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure analytics
- [ ] Set up uptime monitoring
- [ ] Database backup schedule
- [ ] Alert notifications

### Performance
- [ ] Test image loading times
- [ ] Verify CDN configuration
- [ ] Check Lighthouse scores
- [ ] Monitor API response times
- [ ] Database query optimization

## Alternative Hosting Options

### Netlify
1. Connect GitHub repository
2. Configure build settings
3. Add environment variables
4. Deploy

### AWS/DigitalOcean
1. Set up server with Node.js
2. Install dependencies
3. Configure environment variables
4. Use PM2 for process management
5. Set up reverse proxy (Nginx)
6. Configure SSL certificate

### Docker
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## Scaling Considerations

### Performance
- Enable CDN for static assets
- Use image optimization service
- Implement Redis caching
- Database read replicas
- Separate API server

### Cost Optimization
- Monitor Novita AI usage
- Set gem price appropriately
- Implement usage quotas
- Cache generated images
- Optimize database queries

### High Availability
- Multi-region deployment
- Database clustering
- Load balancing
- Automatic failover
- Regular backups

## Maintenance

### Regular Tasks
- [ ] Weekly: Check error logs
- [ ] Weekly: Review user feedback
- [ ] Monthly: Update dependencies
- [ ] Monthly: Review analytics
- [ ] Quarterly: Security audit
- [ ] Yearly: Penetration testing

### Updates
```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Test thoroughly
npm run build
npm run lint

# Deploy
vercel --prod
```

## Troubleshooting

### Build Failures
- Check environment variables
- Verify Node.js version (18+)
- Clear build cache
- Check TypeScript errors

### Runtime Errors
- Check logs in Vercel dashboard
- Verify API keys are correct
- Test database connection
- Verify webhook endpoints

### Performance Issues
- Check Vercel analytics
- Monitor database queries
- Review API response times
- Optimize images

## Support & Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)

## Getting Help

For deployment issues:
1. Check the documentation
2. Review error logs
3. Test in development first
4. Open a GitHub issue
5. Contact support for third-party services

---

**Last Updated**: 2025-12-25
