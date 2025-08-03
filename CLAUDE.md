# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Purpose

This application is an educational tool designed for teachers to automatically generate Google Forms tests from textbook content. 

### Core Functionality
- **Text Content Input**: Teachers paste textbook content or educational materials directly into the application
- **Content Analysis**: AI processes the text content to identify and analyze individual chapters or sections
- **Test Generation**: Automatically generates relevant test questions for the provided content
- **Google Forms Creation**: Converts generated questions into Google Forms for easy distribution
- **Instructional Context**: Includes a separate text area where teachers can specify:
  - Question tone and style preferences
  - Specific instructions for question generation
  - Difficulty level requirements
  - Focus areas or learning objectives

### Target User
Built specifically for teachers who want to streamline the process of creating assessments from textbook materials.

### Planned Workflow
1. Teacher pastes textbook content into the main text area
2. Teacher provides optional instructions for question style/tone in the instructions text area
3. System processes the text content and identifies chapters or sections
4. AI generates appropriate test questions for the content
5. Questions are automatically formatted into Google Forms
6. Teacher receives links to generated forms for distribution

## Development Commands

### Frontend (React/TypeScript)
- `npm run dev` - Start Vite development server
- `npm run build` - Build production assets
- `npm run build:ssr` - Build with SSR support
- `npm run lint` - Run ESLint with auto-fix
- `npm run types` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check formatting without changes

### Backend (Laravel/PHP)
- `composer dev` - Start full development environment (server, queue, logs, vite)
- `composer dev:ssr` - Start development with SSR
- `composer test` - Run PHP tests with Pest
- `php artisan serve` - Start Laravel development server
- `php artisan test` - Run tests
- `vendor/bin/pint` - Format PHP code with Laravel Pint

### Database
- `php artisan migrate` - Run database migrations
- `php artisan migrate:fresh` - Fresh migration (drops all tables)

## Architecture Overview

This is a Laravel + React (Inertia.js) application for generating Google Forms through the Google Forms API.

### Tech Stack
- **Backend**: Laravel 12 with PHP 8.2+
- **Frontend**: React 19 + TypeScript + Tailwind CSS 4
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS with Radix UI components
- **State Management**: Inertia.js for SPA-like navigation
- **Database**: SQLite (default), supports other databases
- **Testing**: Pest (PHP), no frontend testing configured

### Key Components

#### Backend Structure
- `app/Services/FormService.php` - Core Google Forms API integration service
- `routes/web.php` - Main routing including Google OAuth flow
- Google OAuth implementation using service account credentials

#### Frontend Structure  
- `resources/js/pages/` - Inertia.js page components
- `resources/js/components/ui/` - shadcn/ui components (Radix UI primitives)
- `resources/js/layouts/` - Layout components for different page types
- **UI Library**: shadcn/ui component system with Tailwind CSS styling

#### Google Forms Integration
- Uses `google/apiclient` PHP library
- OAuth 2.0 flow for Google API authentication
- Service credentials stored in `client_secret_*.json` files
- Session-based token storage (not production-ready)

### Development Notes

#### Environment Setup
- Copy `.env.example` to `.env` and configure
- Google OAuth credentials required for Forms API
- SQLite database created automatically during setup

#### Code Style
- PHP: Laravel Pint for formatting
- TypeScript/React: Prettier + ESLint configuration
- Tailwind CSS for styling with custom component patterns

#### Testing
- PHP tests use Pest framework
- Test database uses in-memory SQLite
- No frontend testing framework configured

## Security Considerations

- Google service account credentials are committed to repository (development only)
- OAuth tokens stored in session (not suitable for production)
- No CSRF protection on Google OAuth routes