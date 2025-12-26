# Architecture Documentation

## Overview

AI Unlock Gallery is built as a modern, serverless Next.js 15 application using the App Router with a focus on security, privacy, and performance.

## Tech Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS v4**: Utility-first CSS framework
- **shadcn/ui**: Accessible component library
- **Zustand**: Lightweight state management
- **React Konva**: Canvas manipulation for games

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **MongoDB + Mongoose**: NoSQL database with ODM
- **Clerk**: Authentication and user management

### Third-Party Services
- **Novita AI**: NSFW image generation
- **Stripe**: Payment processing
- **Clerk**: Authentication provider

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client (Browser)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Age Gate    │  │   Main App   │  │  Mini-Games  │      │
│  │  Component   │  │   (Gallery)  │  │ (Scratch/Puzzle)│   │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Next.js App Router                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   Middleware                         │   │
│  │              (Clerk Auth Protection)                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                            │                                 │
│  ┌────────────────────┬────┴────┬───────────────────────┐  │
│  │   Pages/Routes     │  API    │   Server Components   │  │
│  │  - Home (/)        │ Routes  │   - Layout            │  │
│  │  - Sign In/Up      │         │   - Loading States    │  │
│  │  - Success         │         │                       │  │
│  └────────────────────┴─────────┴───────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      API Layer                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  /api/   │  │  /api/   │  │  /api/   │  │  /api/   │   │
│  │  user    │  │ generate │  │ gallery  │  │  stripe  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
           │              │              │              │
           ↓              ↓              ↓              ↓
┌────────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐
│   MongoDB      │  │ Novita AI  │  │   Clerk    │  │   Stripe   │
│   Database     │  │    API     │  │    Auth    │  │  Payments  │
└────────────────┘  └────────────┘  └────────────┘  └────────────┘
```

## Data Flow

### User Registration Flow
```
1. User visits app → Age Gate displayed
2. User confirms 18+ → Age gate dismissed
3. User clicks Sign Up → Redirected to Clerk
4. Clerk handles registration → Returns to app
5. App creates User record in MongoDB
6. User gets 10 starting gems
```

### Image Generation Flow
```
1. User enters prompt → Frontend validates input
2. Frontend calls /api/generate → Server validates auth
3. Server checks user gems (≥5) → Deducts 5 gems
4. Server calls Novita AI → Waits for generation
5. Novita returns image URL → Server saves to DB
6. Server returns image data → Frontend updates UI
7. New image added to gallery (locked)
```

### Image Unlock Flow
```
1. User clicks locked image → Game modal opens
2. User plays mini-game → Progress tracked
3. Game completed → Frontend calls /api/gallery
4. Server marks image unlocked → Returns success
5. Gallery updated → Image revealed
```

### Payment Flow
```
1. User selects gem package → Frontend calls /api/stripe/checkout
2. Server creates Stripe session → Returns checkout URL
3. User redirected to Stripe → Completes payment
4. Stripe sends webhook → /api/webhooks/stripe
5. Server verifies webhook → Updates user gems
6. User redirected to success page → Gems updated
```

## Database Schema

### Collections

#### Users
```javascript
{
  _id: ObjectId,
  clerkId: String (unique, indexed),
  email: String,
  gems: Number (default: 10),
  createdAt: Date,
  updatedAt: Date
}
```

#### GalleryImages
```javascript
{
  _id: ObjectId,
  userId: String (indexed),
  imageUrl: String,
  thumbnailUrl: String (optional),
  prompt: String,
  isUnlocked: Boolean (default: false),
  unlockGameType: String (enum: 'scratch', 'puzzle'),
  createdAt: Date,
  updatedAt: Date
}
```

#### Transactions
```javascript
{
  _id: ObjectId,
  userId: String (indexed),
  type: String (enum: 'purchase', 'earn', 'spend'),
  amount: Number,
  description: String,
  stripeSessionId: String (optional),
  createdAt: Date
}
```

### Indexes
- Users: `clerkId` (unique)
- GalleryImages: `userId`, compound index on `(userId, createdAt)`
- Transactions: `userId`, compound index on `(userId, createdAt)`

## State Management

### Zustand Stores

#### UserStore
```typescript
{
  gems: number,
  userId: string | null,
  setGems: (gems: number) => void,
  setUserId: (userId: string) => void,
  decrementGems: (amount: number) => void,
  incrementGems: (amount: number) => void
}
```

#### GalleryStore
```typescript
{
  images: GalleryImage[],
  setImages: (images: GalleryImage[]) => void,
  addImage: (image: GalleryImage) => void,
  updateImage: (id: string, updates: Partial<GalleryImage>) => void
}
```

## Security Architecture

### Authentication Layer
```
Request → Middleware (Clerk) → Protected Route
                ↓
          If unauthorized → 401
          If authorized → Process request
```

### API Protection
1. All API routes require authentication
2. User ID extracted from Clerk session
3. Database queries scoped to user ID
4. No cross-user data access

### Data Privacy
- Gallery images: User-specific, no sharing
- Prompts: Stored but private
- Payments: Handled entirely by Stripe
- Sessions: Managed by Clerk

## Component Structure

### Page Components
```
src/app/
├── page.tsx              # Main gallery page (client)
├── sign-in/page.tsx      # Sign in page
├── sign-up/page.tsx      # Sign up page
└── success/page.tsx      # Payment success page
```

### UI Components
```
src/components/
├── ui/
│   ├── button.tsx        # Reusable button
│   ├── card.tsx          # Card container
│   └── progress.tsx      # Progress bar
└── games/
    ├── ScratchCard.tsx   # Scratch game
    └── SlidingPuzzle.tsx # Puzzle game
```

## API Endpoints

### User Management
- `GET /api/user` - Get/create user data
- `PATCH /api/user` - Update user data

### Image Operations
- `POST /api/generate` - Generate new image
- `GET /api/gallery` - Get user's gallery
- `PATCH /api/gallery` - Unlock image

### Payments
- `POST /api/stripe/checkout` - Create checkout session
- `POST /api/webhooks/stripe` - Handle Stripe webhooks

## Performance Considerations

### Optimization Strategies
1. **Server-Side Operations**: All AI calls on server
2. **Lazy Loading**: Images loaded on demand
3. **State Management**: Minimal re-renders with Zustand
4. **Database Queries**: Indexed and scoped
5. **Static Generation**: Where possible

### Caching Strategy
- Static assets: CDN cached
- API routes: No caching (user-specific)
- Database queries: Connection pooling
- Images: Browser caching via URLs

## Scalability

### Horizontal Scaling
- Serverless functions scale automatically
- MongoDB Atlas handles scaling
- Clerk manages auth scaling
- Stripe handles payment scaling

### Potential Bottlenecks
1. **Novita AI API**: Rate limits and costs
2. **Database**: Query performance at scale
3. **Image Storage**: URLs point to external storage

### Scaling Solutions
1. Implement rate limiting
2. Add caching layer (Redis)
3. Use CDN for images
4. Database read replicas
5. Queue system for generation

## Monitoring & Logging

### What to Monitor
- API response times
- Error rates
- User activity
- Payment success rate
- Image generation failures
- Database performance

### Logging Strategy
- Errors: Always log with context
- API calls: Log with user ID (hashed)
- Payments: Full audit trail
- Security events: Detailed logging

## Deployment Architecture

### Development
```
Local Machine
├── Next.js Dev Server (port 3000)
├── Local MongoDB
└── Test API keys
```

### Production (Vercel)
```
Vercel Edge Network
├── Edge Functions (API Routes)
├── Static Assets (CDN)
└── Environment Variables (Encrypted)
     │
     ├─→ MongoDB Atlas (Database)
     ├─→ Clerk (Auth)
     ├─→ Stripe (Payments)
     └─→ Novita AI (Image Generation)
```

## Error Handling

### Client-Side
- Form validation
- Network error handling
- User-friendly error messages
- Fallback UI states

### Server-Side
- Try-catch blocks
- Detailed error logging
- Generic error responses to client
- Transaction rollbacks

## Testing Strategy

### Manual Testing
- User flows end-to-end
- Payment integration
- Game mechanics
- Mobile responsiveness

### Potential Automated Tests
- Unit tests for utilities
- API route testing
- Component testing
- Integration testing

## Future Enhancements

### Potential Features
1. More mini-games
2. Image editing
3. Collection organization
4. User preferences
5. Referral system
6. Achievement system

### Technical Improvements
1. WebSockets for real-time updates
2. Progressive image loading
3. Better caching strategy
4. Rate limiting
5. Comprehensive testing
6. Performance monitoring

---

**Version**: 1.0.0
**Last Updated**: 2025-12-25
