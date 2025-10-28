# Social Content Management System

## Overview

A modern social content management platform for creating and sharing four types of content: Stories (Instagram-style ephemeral content), Articles (Medium-style long-form reading), Pictures (Pinterest-style visual content), and Videos (YouTube-style video content). Built as a full-stack TypeScript application with a React frontend and Express backend, featuring a clean, reference-based design system inspired by leading social platforms. Data is persisted in a PostgreSQL database using Drizzle ORM.

## Recent Changes (October 28, 2025)

- Fixed database connection issue by configuring Neon serverless WebSocket constructor for Node.js
- Implemented complete video upload feature with modern UI including:
  - Drag-and-drop video upload with visual feedback and progress indicators
  - Video preview with automatic duration extraction
  - Thumbnail upload support for custom video previews
  - Modern gradient-based button styling (purple-to-pink gradient)
  - VideoCard component with hover effects and play button overlay
  - Video detail page with HTML5 video player
- Enhanced home page with gradient title styling and dynamic subtitles that update based on filter selection
- Fixed critical blob URL revocation bug in video preview to ensure proper playback during upload
- All video features fully tested with end-to-end playwright tests passing

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast hot module replacement
- Wouter for lightweight client-side routing (alternative to React Router)
- TanStack Query (React Query) for server state management and data fetching
- React Hook Form with Zod validation for form handling

**UI Component System:**
- shadcn/ui component library with Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Custom theme system supporting light/dark modes
- Design system inspired by Instagram (Stories), Medium (Articles), Pinterest (Pictures), and YouTube (Videos)
- Modern gradient-based styling for video features (purple-to-pink gradient theme)
- Hover effects with play button overlays on video cards
- Typography: Inter for UI elements, Merriweather for article reading
- Responsive grid layouts: masonry for pictures, single-column for articles, horizontal scrolling for stories, grid layout for videos
- Dynamic page subtitles that update based on content filter

**State Management:**
- React Query for server state with optimistic updates and cache invalidation
- Local React state for UI interactions (modals, story viewer)
- No global client state manager needed due to React Query handling server state

**Key Design Patterns:**
- Component-based architecture with separation of concerns
- Custom hooks for reusable logic (use-mobile, use-toast)
- Form validation using Zod schemas shared between client and server
- TypeScript path aliases (@/, @shared/) for clean imports
- Blob URL cleanup using useEffect for proper resource management
- Drag-and-drop file handling with visual feedback states

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript for REST API endpoints
- Custom middleware for request logging and JSON body parsing
- Vite integration in development mode for seamless HMR

**API Structure:**
- RESTful endpoints organized by content type (stories, articles, pictures, videos)
- Consistent CRUD operations: GET /api/:type, GET /api/:type/:id, POST /api/:type, DELETE /api/:type/:id
- File upload endpoints with Multer middleware for image and video handling
- Shared validation schemas between frontend and backend using Zod

**Data Layer:**
- Drizzle ORM for type-safe database operations with PostgreSQL
- Schema-first approach with automatic TypeScript type generation
- Shared schema definitions in `/shared/schema.ts` consumed by both client and server
- DatabaseStorage class implements persistent storage using PostgreSQL
- Storage abstraction pattern (IStorage interface) allows swapping implementations
- Database connection managed via Neon serverless driver with connection pooling
- WebSocket configuration for Neon serverless driver using 'ws' package in Node.js environment

**Error Handling:**
- Centralized error handling for API responses
- Input validation using Zod schemas before database operations
- File upload validation (type checking, size limits)

### Data Storage

**Database:**
- PostgreSQL as the primary database (via Neon serverless driver)
- Drizzle ORM for migrations and query building
- Four main tables: stories, articles, pictures, videos
- All tables use UUID primary keys with automatic generation

**Schema Design:**
```
stories: id, content, author, avatarUrl, createdAt
articles: id, title, content, excerpt, featuredImage, author, avatarUrl, readTime, createdAt  
pictures: id, imageUrl, caption, description, author, avatarUrl, createdAt
videos: id, videoUrl, title, description, thumbnailUrl, duration, author, avatarUrl, createdAt
```

**File Storage:**
- Local filesystem storage in `public/uploads/` directory
- Multer middleware handles multipart form data
- Unique filename generation using timestamp + random suffix
- Static file serving via Express for uploaded files
- Image uploads: 10MB file size limit with type validation (jpeg, jpg, png, gif, webp)
- Video uploads: 100MB file size limit with type validation (mp4, mov, avi, mkv, webm)
- Separate endpoints: `/api/upload` for images, `/api/upload-video` for videos

### Authentication & Authorization

**Current State:**
- No authentication system implemented
- Content creation is open to any user
- Author information is manually entered in forms (not tied to user accounts)

**Future Considerations:**
- User authentication would require session management or JWT tokens
- Connect-pg-simple package included for potential session storage
- Would need to add user table and foreign key relationships to content tables

## External Dependencies

**Core Runtime:**
- Node.js with ES modules
- TypeScript for type safety across the stack

**Database & ORM:**
- PostgreSQL database (via DATABASE_URL environment variable)
- Neon serverless PostgreSQL driver (@neondatabase/serverless)
- Drizzle ORM for schema management and queries
- Drizzle Kit for migrations and schema pushing

**Frontend Libraries:**
- React 18 for UI rendering
- TanStack Query v5 for data fetching and caching
- Wouter for client-side routing
- React Hook Form for form state management
- Zod for schema validation
- date-fns for date formatting

**UI Components:**
- Radix UI primitives (30+ component packages)
- shadcn/ui component patterns
- Tailwind CSS for styling
- class-variance-authority for component variants
- Lucide React for icons

**Backend Services:**
- Express.js web framework
- Multer for file upload handling
- Connect-pg-simple for session storage (configured but not actively used)

**Development Tools:**
- Vite for frontend bundling and dev server
- esbuild for backend bundling in production
- tsx for TypeScript execution in development
- Replit-specific plugins for development environment integration

**Environment Variables Required:**
- DATABASE_URL: PostgreSQL connection string (must be set for Drizzle to work)