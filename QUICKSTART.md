# Quick Start Guide

Get AI Unlock Gallery running locally in under 10 minutes!

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js 18 or higher (`node --version`)
- ✅ Git installed
- ✅ A code editor (VS Code recommended)

## Step-by-Step Setup

### 1. Clone and Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/brocketdesign/ai-unlock-gallery.git
cd ai-unlock-gallery

# Install dependencies
npm install
```

### 2. Set Up Environment Variables (3 minutes)

```bash
# Copy the example environment file
cp .env.example .env.local
```

Open `.env.local` and add your API keys:

**Minimum Required for Testing:**
- Clerk keys (free): [Get from Clerk Dashboard](https://dashboard.clerk.com)
- MongoDB URI: Use `mongodb://localhost:27017/ai-unlock-gallery` for local testing

**Optional for Full Testing:**
- Stripe keys (test mode): [Get from Stripe Dashboard](https://dashboard.stripe.com)
- Novita AI key: [Get from Novita](https://novita.ai)

### 3. Start MongoDB (2 minutes)

**Option A: Using Docker (Recommended)**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option B: Install MongoDB Locally**
- Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
- Follow installation instructions for your OS
- Start MongoDB service

### 4. Start Development Server (1 minute)

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## First-Time Usage

### 1. Create Account
1. Visit http://localhost:3000
2. Accept age verification (18+)
3. Click "Sign Up"
4. Create account with email/password
5. You'll start with 10 free gems!

### 2. Generate Your First Image
1. Enter a prompt in the text box
2. Click "Generate Image" (costs 5 gems)
3. Wait for generation (or see note below about API keys)
4. Find the locked image in your gallery

### 3. Unlock the Image
1. Click on the locked image
2. Play the mini-game (scratch or puzzle)
3. Complete the game to reveal the image
4. Image is now permanently unlocked!

### 4. Buy More Gems (Optional)
1. Click on a gem package
2. You'll be redirected to Stripe checkout
3. Use test card: `4242 4242 4242 4242`
4. Complete checkout
5. Gems added to your account

## Important Notes

### Without Novita AI Key
If you don't have a Novita AI key:
- Image generation will fail
- You'll get an error message
- Everything else will work fine
- Consider getting a key to test the full experience

### Without Stripe Keys
If you don't have Stripe keys:
- Gem purchase will show an error
- You can still use your starting gems
- All other features work normally

### Development Features
The app includes:
- ✅ Hot reload for instant updates
- ✅ TypeScript type checking
- ✅ Tailwind CSS for styling
- ✅ Detailed error messages

## Troubleshooting

### Port 3000 Already in Use
```bash
# Use a different port
PORT=3001 npm run dev
```

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
# For Docker:
docker ps | grep mongodb

# For local install:
# Check your system's service manager
```

### Clerk Authentication Error
- Ensure you copied the correct API keys
- Check that keys don't have extra spaces
- Verify keys are for the same Clerk application

### Build Errors
```bash
# Clear build cache
rm -rf .next
rm -rf node_modules
npm install
npm run dev
```

## Next Steps

### Explore the Code
```
src/
├── app/              # Pages and API routes
├── components/       # React components
├── lib/              # Utilities
├── models/           # Database models
└── store/            # State management
```

### Read the Documentation
- [README.md](README.md) - Project overview
- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical details
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deploy to production
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribute to the project
- [SECURITY.md](SECURITY.md) - Security best practices

### Customize the App
1. Modify gem costs in `src/app/api/generate/route.ts`
2. Add new games in `src/components/games/`
3. Customize UI in `src/components/ui/`
4. Adjust styling with Tailwind classes

### Deploy to Production
When ready to go live:
1. Read [DEPLOYMENT.md](DEPLOYMENT.md)
2. Get production API keys
3. Set up MongoDB Atlas
4. Deploy to Vercel
5. Configure custom domain

## Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

## Getting Help

### Resources
- 📖 [Full Documentation](README.md)
- 🐛 [Report Issues](https://github.com/brocketdesign/ai-unlock-gallery/issues)
- 💬 [Discussions](https://github.com/brocketdesign/ai-unlock-gallery/discussions)

### Support
If you're stuck:
1. Check the error message
2. Review the documentation
3. Search existing issues
4. Create a new issue with details

## Success Checklist

- [ ] Repository cloned
- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] MongoDB running
- [ ] Development server started
- [ ] Account created
- [ ] First image generated
- [ ] First game played
- [ ] Image unlocked

## What's Next?

Now that you have it running:
- 🎨 Generate more images with different prompts
- 🎮 Try both game types (scratch and puzzle)
- 💎 Test the gem purchase flow
- 🔒 Explore the security features
- 🚀 Consider deploying to production

---

**Estimated Setup Time**: 5-10 minutes
**Difficulty**: Beginner-friendly

Need help? Open an issue on GitHub!
