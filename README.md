# Delivery Dashboard

A modern Next.js application for managing delivery orders with Supabase as the backend database.

## Features

- 🚀 **Real-time Data**: Powered by Supabase for instant updates
- 📊 **Dashboard Interface**: Clean and intuitive order management
- 🎨 **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- 🔄 **CRUD Operations**: Create, read, update, and delete orders
- ⚡ **TypeScript**: Full type safety throughout the application
- 🎯 **Optimistic Updates**: Smooth user experience with immediate feedback

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **State Management**: React hooks with custom useOrders hook
- **Forms**: React Hook Form with Zod validation
- **Deployment**: Vercel-ready

## Quick Start

### Prerequisites

1. Node.js 18+ 
2. Supabase account (free at https://supabase.com)
3. Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd studio-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project at https://supabase.com
   - Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
   - Copy your project URL and anon key

4. **Configure environment variables**
   ```bash
   # Create .env.local file
   cp .env.local.example .env.local
   ```
   
   Add your Supabase credentials to `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:9002](http://localhost:9002)

## Database Schema

The application uses a single `orders` table:

```sql
CREATE TABLE orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    company TEXT NOT NULL,
    container_size TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    delivery_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main dashboard page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Dashboard.tsx      # Main dashboard component
│   ├── OrderForm.tsx      # Order form component
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
│   ├── useOrders.ts      # Supabase orders hook
│   └── use-toast.ts      # Toast notifications
├── lib/                  # Utility functions
│   ├── supabase.ts       # Supabase client
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Utility functions
└── styles/               # Additional styles
```

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your Supabase environment variables in Vercel's dashboard
4. Deploy!

The application is optimized for Vercel hosting with automatic deployments on push.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Check the [Supabase documentation](https://supabase.com/docs)
- Review the [Next.js documentation](https://nextjs.org/docs)
- Open an issue on GitHub
