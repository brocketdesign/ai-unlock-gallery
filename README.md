# AI Unlock Gallery 🔞

An engaging, adult-oriented web app built with **Next.js 15** that combines AI image generation with addictive mini-games. Users complete quick challenges (scratch-to-reveal or sliding puzzles) to progressively unlock unique, personalized **NSFW images** generated using the **Novita AI API**.

## ⚠️ Content Warning

**This application is strictly for users 18 years or older.** It generates NSFW (Not Safe For Work) AI-generated images. All content is synthetic and created by artificial intelligence.

## 🚀 Features

### Core Functionality
- ✅ **Clerk Authentication** - Secure user authentication with 18+ age verification
- ✅ **Gems Economy** - Earn or purchase gems to generate images
- ✅ **Novita AI Integration** - Server-side NSFW image generation
- ✅ **Mini-Games** 
  - Scratch Card - Reveal images by scratching
  - Sliding Puzzle - Solve puzzles to unlock images
- ✅ **Private Gallery** - Secure, user-specific image storage
- ✅ **Stripe Payments** - Purchase gem packages
- ✅ **MongoDB Database** - Persistent data storage
- ✅ **Zustand State Management** - Efficient client-side state
- ✅ **Tailwind CSS + shadcn/ui** - Modern, responsive UI

### Security Features
- 🔒 Age gate verification
- 🔒 Server-only AI API calls
- 🔒 Clerk authentication protection
- 🔒 Private gallery per user
- 🔒 Content warnings throughout app

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Authentication**: Clerk
- **Database**: MongoDB with Mongoose
- **Payments**: Stripe
- **AI Provider**: Novita AI
- **State Management**: Zustand
- **UI Components**: shadcn/ui + Tailwind CSS
- **Styling**: Tailwind CSS v4

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB instance
- Clerk account
- Stripe account
- Novita AI API key

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/brocketdesign/ai-unlock-gallery.git
   cd ai-unlock-gallery
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

   Fill in your credentials:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
   CLERK_SECRET_KEY=sk_test_xxx
   
   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/ai-unlock-gallery
   
   # Stripe
   STRIPE_SECRET_KEY=sk_test_xxx
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
   STRIPE_WEBHOOK_SECRET=whsec_xxx
   
   # Novita AI
   NOVITA_API_KEY=your_novita_api_key_here
   NOVITA_API_URL=https://api.novita.ai/v3/async/txt2img
   
   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the app**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 Usage

### For Users

1. **Sign Up** - Create an account (must be 18+)
2. **Verify Age** - Accept the age verification prompt
3. **Get Gems** - Start with 10 free gems or purchase more
4. **Generate Images** - Enter a prompt and generate AI images (5 gems per image)
5. **Play Mini-Games** - Unlock images by completing scratch or puzzle games
6. **View Gallery** - Access your private collection of unlocked images

### Gem Packages

- **50 Gems** - $4.99
- **150 Gems** - $9.99 (Best Value)
- **500 Gems** - $29.99

### Game Types

- **Scratch Card** - Scratch away the overlay to reveal the image (70% threshold)
- **Sliding Puzzle** - Solve a 3x3 sliding puzzle to unlock

## 🔐 API Routes

- `POST /api/generate` - Generate new AI image
- `GET /api/user` - Get user data and gems
- `PATCH /api/user` - Update user data
- `GET /api/gallery` - Get user's gallery images
- `PATCH /api/gallery` - Unlock an image
- `POST /api/stripe/checkout` - Create Stripe checkout session
- `POST /api/webhooks/stripe` - Handle Stripe webhooks

## 🗄 Database Schema

### User
```typescript
{
  clerkId: string;
  email: string;
  gems: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### GalleryImage
```typescript
{
  userId: string;
  imageUrl: string;
  prompt: string;
  isUnlocked: boolean;
  unlockGameType: 'scratch' | 'puzzle';
  createdAt: Date;
  updatedAt: Date;
}
```

### Transaction
```typescript
{
  userId: string;
  type: 'purchase' | 'earn' | 'spend';
  amount: number;
  description: string;
  stripeSessionId?: string;
  createdAt: Date;
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Make sure to update:
- `NEXT_PUBLIC_APP_URL` to your production domain
- Use production Clerk keys
- Use production Stripe keys
- Configure Stripe webhook endpoint

### Stripe Webhook Setup

1. Create webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
2. Listen for: `checkout.session.completed`
3. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

## 🧪 Development

### Build
```bash
npm run build
```

### Lint
```bash
npm run lint
```

### Type Check
```bash
npx tsc --noEmit
```

## 📝 License

This project is for educational purposes. Ensure compliance with:
- Age verification laws in your jurisdiction
- AI service provider terms of service
- Payment processor policies for adult content
- Data protection regulations (GDPR, CCPA, etc.)

## ⚖️ Responsible Use

- **Age Verification**: Always verify users are 18+
- **Content Moderation**: Monitor generated content
- **Privacy**: User galleries are private and secure
- **Transparency**: All images are clearly labeled as AI-generated
- **Legal Compliance**: Follow local laws regarding adult content

## 🤝 Contributing

This is a demonstration project. Contributions should focus on:
- Improved security measures
- Better age verification
- Enhanced content moderation
- Privacy improvements

## 📧 Support

For issues or questions, please open a GitHub issue.

---

**⚠️ Warning**: This application generates adult content. Use responsibly and ensure compliance with all applicable laws and regulations.
