# Reggie App - Agent Instructions

## Project Overview
**Name**: reggieapp  
**Framework**: Next.js 15 with App Router (TypeScript)  
**Authentication**: Privy (email, Google, Twitter login)  
**Styling**: Tailwind CSS v4  
**Purpose**: Social authentication app with Twitter integration

## Commands
- **Dev**: `npm run dev --turbopack` - Development server with Turbopack
- **Build**: `npm run build` - Production build  
- **Start**: `npm run start` - Production server
- **Lint**: `npm run lint` - ESLint checks

## Key Dependencies
- **Next.js**: 15.4.1 with App Router
- **React**: 19.1.0
- **Privy**: Authentication (@privy-io/react-auth, @privy-io/server-auth)
- **Tailwind CSS**: v4 for styling
- **TypeScript**: v5

## Architecture
```
app/
├── layout.tsx          # Root layout with Providers wrapper
├── page.tsx            # Home page with login/Twitter functionality  
├── provider.tsx        # Privy authentication provider
├── globals.css         # Global styles
├── favicon.ico
└── api/
    └── twitter/
        └── post/
            └── route.ts # Twitter posting API endpoint
```

## Code Standards
- **TypeScript**: Functional components, explicit types
- **Client Components**: Use 'use client' directive for interactive components
- **Authentication**: Privy provider wraps app in layout.tsx
- **API Routes**: Server-side authentication with Privy token verification
- **Styling**: Tailwind CSS with responsive design
- **Fonts**: Geist Sans and Geist Mono via next/font

## Environment Variables
- `NEXT_PUBLIC_PRIVY_APP_ID` - Privy public app ID
- `PRIVY_APP_SECRET` - Privy server secret (server-side only)

## Key Features
- Social authentication (email, Google, Twitter) via Privy
- Twitter account linking and posting capability
- Server-side token verification for API routes
- Responsive design with Tailwind CSS
