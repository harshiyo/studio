# Supabase Setup Guide

This guide will help you set up Supabase for your Next.js application.

## Prerequisites

1. A Supabase account (free at https://supabase.com)
2. Your Supabase project URL and anon key

## Setup Steps

### 1. Create a Supabase Project

1. Go to https://supabase.com and sign up/login
2. Create a new project
3. Note down your project URL and anon key

### 2. Set up the Database Schema

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-schema.sql` into the editor
4. Run the SQL to create the orders table and necessary policies

### 3. Configure Environment Variables (Optional)

For better security, you can create a `.env.local` file in your project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://yfrfspkggmvxgfchiwvh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmcmZzcGtnZ212eGdmY2hpd3ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NjQ5NzUsImV4cCI6MjA3MDM0MDk3NX0.UdJ4CjjR95ebPzy5DdIBHySAL_E9lPBK9DYvJ0N9P6o
```

Then update `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 4. Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your Supabase environment variables in Vercel's dashboard
4. Deploy!

## Database Schema

The application uses a single `orders` table with the following structure:

- `id` (UUID, Primary Key): Unique identifier for each order
- `customer_name` (TEXT): Customer's name
- `company` (TEXT): Company name
- `container_size` (TEXT): Container size (constrained to specific values)
- `quantity` (INTEGER): Number of containers
- `delivery_date` (TIMESTAMP): Delivery date and time
- `status` (TEXT): Order status ('pending' or 'completed')
- `created_at` (TIMESTAMP): When the order was created
- `updated_at` (TIMESTAMP): When the order was last updated

## Features

- ✅ Real-time data with Supabase
- ✅ Automatic timestamps
- ✅ Row Level Security (RLS) enabled
- ✅ Optimistic updates for better UX
- ✅ Error handling with toast notifications
- ✅ Loading states
- ✅ Type-safe operations

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your Supabase project allows requests from your domain
2. **RLS Policy Errors**: Check that the RLS policies are correctly set up
3. **Type Errors**: Ensure your TypeScript types match the database schema

### Getting Help

- Check the Supabase documentation: https://supabase.com/docs
- Review the console for error messages
- Verify your Supabase credentials are correct
