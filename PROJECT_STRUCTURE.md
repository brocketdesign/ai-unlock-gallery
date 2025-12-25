# Project Structure

## Overview
```
ai-unlock-gallery/
├── src/                          # Source code
│   ├── app/                      # Next.js app directory
│   │   ├── api/                  # API routes
│   │   │   ├── gallery/          # Gallery management
│   │   │   │   └── route.ts      # GET/PATCH gallery images
│   │   │   ├── generate/         # Image generation
│   │   │   │   └── route.ts      # POST generate image
│   │   │   ├── stripe/           # Payment processing
│   │   │   │   └── checkout/
│   │   │   │       └── route.ts  # POST create checkout
│   │   │   ├── user/             # User management
│   │   │   │   └── route.ts      # GET/PATCH user data
│   │   │   └── webhooks/         # Webhook handlers
│   │   │       └── stripe/
│   │   │           └── route.ts  # POST Stripe webhook
│   │   ├── sign-in/              # Authentication pages
│   │   │   └── page.tsx
│   │   ├── sign-up/
│   │   │   └── page.tsx
│   │   ├── success/              # Payment success
│   │   │   └── page.tsx
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Home page (main app)
│   │   ├── globals.css           # Global styles
│   │   └── favicon.ico
│   ├── components/               # React components
│   │   ├── games/                # Mini-game components
│   │   │   ├── ScratchCard.tsx   # Scratch-to-reveal game
│   │   │   └── SlidingPuzzle.tsx # Sliding puzzle game
│   │   └── ui/                   # UI components
│   │       ├── button.tsx        # Button component
│   │       ├── card.tsx          # Card component
│   │       └── progress.tsx      # Progress bar
│   ├── lib/                      # Utility functions
│   │   ├── mongodb.ts            # MongoDB connection
│   │   └── utils.ts              # Helper utilities
│   ├── models/                   # Database models
│   │   ├── GalleryImage.ts       # Gallery image schema
│   │   ├── Transaction.ts        # Transaction schema
│   │   └── User.ts               # User schema
│   ├── store/                    # State management
│   │   └── index.ts              # Zustand stores
│   ├── types/                    # TypeScript types
│   │   └── index.ts              # Type definitions
│   └── middleware.ts             # Clerk middleware
├── public/                       # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── Documentation/                # Project documentation
│   ├── ARCHITECTURE.md           # Technical architecture
│   ├── CHANGELOG.md              # Version history
│   ├── CONTRIBUTING.md           # Contribution guidelines
│   ├── DEPLOYMENT.md             # Deployment guide
│   ├── QUICKSTART.md             # Quick start guide
│   ├── README.md                 # Project overview
│   └── SECURITY.md               # Security guidelines
├── Configuration Files/
│   ├── .env.example              # Environment variables template
│   ├── .gitignore                # Git ignore rules
│   ├── eslint.config.mjs         # ESLint configuration
│   ├── next.config.ts            # Next.js configuration
│   ├── package.json              # Dependencies and scripts
│   ├── postcss.config.mjs        # PostCSS configuration
│   └── tsconfig.json             # TypeScript configuration
└── LICENSE                       # MIT License
```

## File Descriptions

### Source Code

#### API Routes (`src/app/api/`)
- **gallery/route.ts**: Manage user's gallery images
  - GET: Fetch all user images
  - PATCH: Unlock an image
  
- **generate/route.ts**: Generate AI images
  - POST: Create new image with Novita AI
  - Deducts gems, calls API, saves to database
  
- **stripe/checkout/route.ts**: Payment processing
  - POST: Create Stripe checkout session
  - Returns checkout URL
  
- **user/route.ts**: User data management
  - GET: Fetch/create user data
  - PATCH: Update user data
  
- **webhooks/stripe/route.ts**: Stripe webhook handler
  - POST: Handle payment completion
  - Credits gems to user account

#### Pages (`src/app/`)
- **page.tsx**: Main application page
  - Age gate verification
  - Image generation interface
  - Gallery display
  - Gem purchase UI
  - Mini-game modal
  
- **layout.tsx**: Root layout component
  - Clerk provider wrapper
  - Global styles
  - Metadata configuration
  
- **sign-in/page.tsx**: Sign in page
  - Clerk SignIn component
  
- **sign-up/page.tsx**: Sign up page
  - Clerk SignUp component
  - 18+ warning
  
- **success/page.tsx**: Payment success page
  - Confirmation message
  - Return to gallery link

#### Components

##### Games (`src/components/games/`)
- **ScratchCard.tsx**: Interactive scratch card
  - Canvas-based scratching
  - Completion detection (70% threshold)
  - Touch and mouse support
  
- **SlidingPuzzle.tsx**: Sliding puzzle game
  - 3x3 grid puzzle
  - Shuffle algorithm
  - Move validation
  - Completion detection

##### UI (`src/components/ui/`)
- **button.tsx**: Reusable button component
  - Multiple variants
  - Size options
  - Accessible
  
- **card.tsx**: Card container component
  - Header, content, footer sections
  - Consistent styling
  
- **progress.tsx**: Progress bar component
  - Radix UI based
  - Smooth animations

#### Libraries (`src/lib/`)
- **mongodb.ts**: Database connection
  - Connection pooling
  - Environment configuration
  - Global cache
  
- **utils.ts**: Utility functions
  - Class name merger (cn)
  - Tailwind integration

#### Models (`src/models/`)
- **User.ts**: User schema
  - Clerk ID reference
  - Gem balance
  - Timestamps
  
- **GalleryImage.ts**: Gallery image schema
  - User reference
  - Image URL
  - Lock state
  - Game type
  
- **Transaction.ts**: Transaction schema
  - User reference
  - Transaction type
  - Amount and description
  - Stripe reference

#### Store (`src/store/`)
- **index.ts**: Zustand state stores
  - UserStore: gems, user ID
  - GalleryStore: images array

#### Types (`src/types/`)
- **index.ts**: TypeScript type definitions
  - User types
  - Gallery image types
  - Transaction types
  - API request/response types

#### Middleware
- **middleware.ts**: Clerk authentication
  - Route protection
  - Public route matching
  - Auth validation

### Configuration

#### Environment
- **.env.example**: Environment template
  - All required variables
  - Example values
  - Documentation

#### Build Tools
- **next.config.ts**: Next.js configuration
- **tsconfig.json**: TypeScript settings
- **eslint.config.mjs**: Linting rules
- **postcss.config.mjs**: PostCSS setup

#### Package Management
- **package.json**: Dependencies and scripts
  - All npm packages
  - Build scripts
  - Version information

### Documentation

- **README.md**: Project overview and features
- **QUICKSTART.md**: Fast setup guide
- **ARCHITECTURE.md**: Technical architecture
- **DEPLOYMENT.md**: Production deployment
- **SECURITY.md**: Security guidelines
- **CONTRIBUTING.md**: Contribution guide
- **CHANGELOG.md**: Version history
- **LICENSE**: MIT license with adult content terms

## File Count

- **TypeScript Files**: 21
- **Documentation Files**: 8
- **Configuration Files**: 7
- **Total Project Files**: ~50+

## Code Organization

### Frontend
- Client components: `"use client"` directive
- Server components: Default
- API routes: Separate files
- Shared types: Central location

### Backend
- Mongoose models: One per collection
- API handlers: RESTful design
- Database: Connection singleton
- Validation: Zod schemas (can be added)

### Styling
- Tailwind: Utility classes
- Components: Consistent design
- Responsive: Mobile-first
- Themes: Dark mode ready

## Import Paths

All imports use the `@/` alias:
```typescript
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { User } from '@/models/User'
import { useUserStore } from '@/store'
```

## Key Dependencies

### Frontend
- next: ^16.1.1
- react: ^19.2.3
- @clerk/nextjs: ^6.36.5
- zustand: ^5.0.9
- tailwindcss: ^4

### Backend
- mongoose: ^9.0.2
- stripe: ^20.1.0
- axios: ^1.13.2

### UI
- @radix-ui/*: Various components
- lucide-react: ^0.562.0
- tailwind-merge: ^3.4.0

## Build Output

### Development
- `.next/`: Build cache
- `node_modules/`: Dependencies

### Production
- `.next/`: Optimized build
- Static assets: Cached
- API routes: Serverless functions

---

**Last Updated**: 2025-12-25
