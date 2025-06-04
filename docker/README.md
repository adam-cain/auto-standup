# Docker Development Setup

This directory contains Docker configuration for local development.

## Services

- **PostgreSQL**: Database server on port 5432
- **Redis**: Cache and message broker on port 6379

## Quick Start

1. **Start the services:**
   ```bash
   npm run docker:up
   ```

2. **Set up the database:**
   ```bash
   npm run dev:setup
   ```
   This command will:
   - Start Docker services
   - Generate Prisma client
   - Run database migrations
   - Seed the database

3. **Start development server:**
   ```bash
   npm run dev
   ```

## Available Commands

- `npm run docker:up` - Start Docker services in the background
- `npm run docker:down` - Stop Docker services
- `npm run docker:logs` - View logs from all services
- `npm run docker:restart` - Restart all services
- `npm run docker:clean` - Stop services and remove volumes (⚠️ removes all data)
- `npm run dev:setup` - Complete development setup

## Database Connection

The PostgreSQL database will be available at:
- **Host**: localhost
- **Port**: 5432
- **Database**: auto_standup
- **Username**: postgres
- **Password**: postgres

**Connection String**: `postgresql://postgres:postgres@localhost:5432/auto_standup`

## Data Persistence

Database data is persisted in Docker volumes:
- `postgres_data` - PostgreSQL data
- `redis_data` - Redis data

To completely reset the database, use: `npm run docker:clean`

## Environment Variables

Make sure your `.env` file contains:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/auto_standup"
REDIS_URL="redis://localhost:6379"
``` 