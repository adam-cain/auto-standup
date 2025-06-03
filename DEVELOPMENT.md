# Auto Standup - Development Setup

This guide will help you set up the Auto Standup project for local development.

## Prerequisites

- **Node.js** - Version 18.17 or higher
- **PostgreSQL** - Version 14 or higher
- **Redis** - Version 6 or higher (for background jobs)
- **Git** - For version control

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd auto-standup
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   # Database
   DATABASE_URL=postgresql://username:password@localhost:5432/auto_standup_dev
   
   # Authentication
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   
   # Google OAuth (for authentication)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run database migrations
   npm run db:migrate
   
   # Seed the database with initial data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Setup

### PostgreSQL Setup

1. **Install PostgreSQL** (if not already installed)
   - macOS: `brew install postgresql`
   - Ubuntu: `sudo apt-get install postgresql postgresql-contrib`
   - Windows: Download from [postgresql.org](https://www.postgresql.org/download/)

2. **Create a database**
   ```bash
   createdb auto_standup_dev
   ```

3. **Update your DATABASE_URL** in `.env.local`

### Redis Setup (Optional - for background jobs)

1. **Install Redis**
   - macOS: `brew install redis`
   - Ubuntu: `sudo apt-get install redis-server`
   - Windows: Use WSL or Docker

2. **Start Redis**
   ```bash
   redis-server
   ```

## Authentication Setup

### Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
6. Copy the Client ID and Client Secret to your `.env.local`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Database Scripts

- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Prisma Studio
- `npm run db:reset` - Reset database (⚠️ destructive)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Dashboard pages
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/                # Reusable UI components
│   ├── auth/              # Authentication components
│   └── dashboard/         # Dashboard components
├── lib/                   # Utility libraries
│   ├── auth.ts            # NextAuth configuration
│   ├── db.ts              # Database client
│   └── utils.ts           # Utility functions
└── types/                 # TypeScript type definitions
    └── index.ts           # Main type definitions

prisma/
├── schema.prisma          # Database schema
└── seed.ts                # Database seeding script
```

## Key Features Implemented

### ✅ Foundation
- [x] Next.js 15 with App Router
- [x] TypeScript configuration
- [x] Tailwind CSS with shadcn/ui components
- [x] PostgreSQL database with Prisma ORM
- [x] NextAuth.js authentication with Google OAuth
- [x] Multi-tenant database schema

### ✅ Core Components
- [x] Landing page with feature showcase
- [x] Authentication pages (sign-in)
- [x] Dashboard layout with navigation
- [x] Basic API routes for organizations
- [x] Database seeding with sample data

### 🚧 In Progress
- [ ] Workflow automation engine
- [ ] Visual workflow builder
- [ ] Messaging platform integrations
- [ ] Team management
- [ ] Analytics dashboard

## Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm run lint
   npm run type-check
   npm run build
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

## Troubleshooting

### Common Issues

1. **Database connection errors**
   - Ensure PostgreSQL is running
   - Check your DATABASE_URL in `.env.local`
   - Verify database exists and user has permissions

2. **Authentication not working**
   - Check Google OAuth credentials
   - Verify NEXTAUTH_SECRET is set
   - Ensure redirect URIs are configured correctly

3. **Build errors**
   - Run `npm run type-check` to identify TypeScript issues
   - Check for missing dependencies
   - Clear `.next` folder and rebuild

### Getting Help

- Check the [main README](./README.md) for project overview
- Review the [database schema](./prisma/schema.prisma)
- Look at existing components for patterns
- Check the [Next.js documentation](https://nextjs.org/docs)

## Next Steps

1. Set up your development environment using this guide
2. Explore the codebase and existing components
3. Check the main README for the full feature roadmap
4. Start contributing to the areas that interest you most!

Happy coding! 🚀 