# Trendscreener

A powerful social media analytics platform that lets you create, save, and analyze lists of trending content across multiple platforms. Built for content creators, social media professionals, and traders seeking insights into social media trends. 

![Trendscreener](./public/logo.png)

## Features 

### 🔍 **Trend Analysis**

- Create and manage custom trend lists
- Track engagement metrics across platforms (likes, views, replies, shares)
- Real-time statistics aggregation
- Historical performance tracking

### 🌐 **Multi-Platform Support**

- Twitter/X integration with tweet embedding
- Instagram post tracking
- TikTok support (coming soon)
- Telegram integration (coming soon)

### 📊 **Analytics Dashboard**

- Advanced engagement insights
- Visual data representation with charts
- Performance metrics tracking
- Export capabilities

### 🔐 **Authentication**

- Multiple sign-in options:
  - Google OAuth
  - GitHub OAuth
  - Discord OAuth
- Secure user sessions
- Privacy-focused data handling

### 📱 **Modern UI/UX**

- Responsive design for all devices
- Dark theme optimized
- Intuitive navigation
- Real-time updates

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn UI + Custom components
- **Authentication**: Better-auth with multiple providers
- **Database**: PostgreSQL with Drizzle ORM
- **Deployment**: Vercel-ready
- **Analytics**: Real-time social media data aggregation

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database
- Social media API keys (for OAuth)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/trendscreener.git
cd trendscreener
```

2. **Install dependencies**

```bash
bun install
# or
npm install
```

3. **Environment Setup**

```bash
cp .env.example .env
```

Fill in your environment variables:

```env
```env
# Database
DATABASE_URL="your-postgresql-url"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"

# Social Media APIs
TWITTER_BEARER_TOKEN="your-twitter-bearer-token"

# Additional Services (Optional)
SUPABASE_URL="your-supabase-url"
SUPABASE_KEY="your-supabase-anon-key"
RAPIDAPI_KEY="your-rapidapi-key"
```
```

4. **Database Setup**

```bash
# Generate database schema
bun run db:generate

# Run migrations
bun run db:migrate
```

5. **Run Development Server**

```bash
bun dev
# or
npm run dev
```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## Usage

### Creating Trend Lists

1. **Sign in** using your preferred OAuth provider
2. **Navigate** to the Trendscreen page (`/app/trendscreen`)
3. **Add social media URLs** by pasting them into the input field
4. **Save your list** with a custom name and description
5. **Track performance** as metrics are automatically updated

### Managing Lists

- **View all lists** from your dashboard
- **Edit existing lists** by adding/removing content
- **Share lists** by making them public
- **Export data** for external analysis

### Analytics Features

- **Real-time metrics** for all tracked content
- **Engagement trends** over time
- **Platform comparison** analytics
- **Performance insights** and recommendations

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (landing)/         # Landing page components
│   ├── app/               # Main application pages
│   │   ├── dashboard/     # User dashboard
│   │   ├── trendscreen/   # Trend creation/management
│   │   ├── privacy/       # Privacy policy
│   │   └── tos/          # Terms of service
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # Shadcn UI components
│   ├── auth-card.tsx     # Authentication component
│   └── user-profile.tsx  # User profile dropdown
├── lib/                  # Utility libraries
└── styles/               # Additional styling
```

## API Endpoints 

The application includes several API routes for: 

- Social media data fetching
- User authentication
- Trend list management


