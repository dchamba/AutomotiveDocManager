# AutoDoc Pro - AIAG-VDA Documentation System

## Overview

AutoDoc Pro is a full-stack web application designed for automotive quality documentation management, specifically implementing AIAG-VDA standards for FMEA (Failure Mode and Effects Analysis), Control Plans, and Flow Charts. The system provides a comprehensive solution for managing clients, products, product versions, and their associated quality documentation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: Custom automotive-themed design system with CSS variables

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL using Neon serverless database
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Development**: tsx for TypeScript execution in development

### Key Components

#### Data Management
- **Database Schema**: Hierarchical structure with Users → Clients → Products → Product Versions → Process Phases/Documents
- **Schema Validation**: Zod schemas for runtime type validation
- **Database Connection**: Connection pooling with Neon serverless PostgreSQL

#### User Interface
- **Design System**: Custom automotive-themed UI with blue/orange color scheme
- **Responsive Layout**: Mobile-first design with sidebar navigation
- **Component Architecture**: Modular shadcn/ui components with custom automotive styling
- **Interactive Elements**: React Flow integration planned for flowchart editing

#### API Structure
- **RESTful Design**: Standard HTTP methods for CRUD operations
- **Route Organization**: Modular route handlers for different entity types
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Data Validation**: Server-side validation using Zod schemas

## Data Flow

1. **Client Management**: Create and manage automotive company clients with contact information
2. **Product Catalog**: Define products for each client with codes and descriptions
3. **Version Control**: Track product versions with dates, responsible persons, and change descriptions
4. **Process Documentation**: Create process phases and associated quality documents
5. **Document Types**: Support for Flow Charts, FMEA analyses, and Control Plans

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Accessible UI primitives for shadcn/ui components
- **@reactflow/***: Planned integration for visual flowchart editing
- **drizzle-orm**: Type-safe database ORM with PostgreSQL dialect

### Development Tools
- **drizzle-kit**: Database schema management and migrations
- **tailwindcss**: Utility-first CSS framework
- **typescript**: Static type checking
- **vite**: Fast development server and build tool

### Validation and Forms
- **zod**: Schema validation for both client and server
- **react-hook-form**: Form state management with validation
- **@hookform/resolvers**: Zod integration for form validation

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express backend
- **Hot Module Replacement**: Enabled for React components
- **TypeScript Checking**: Real-time type checking during development
- **Database**: Connection to remote Neon PostgreSQL instance

### Production Build
- **Frontend Build**: Vite production build with optimized assets
- **Backend Bundle**: esbuild bundling for Node.js deployment
- **Static Assets**: Served from Express with fallback to React app
- **Environment Variables**: DATABASE_URL required for database connection

### Database Management
- **Schema Migrations**: Drizzle Kit push/pull for schema synchronization
- **Connection Pooling**: Configured for serverless PostgreSQL
- **WebSocket Support**: Configured for Neon serverless features

The application follows a traditional full-stack architecture with a clear separation between client and server code, utilizing modern tooling for development efficiency and production performance.