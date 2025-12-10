# SocioShare - Shopify Social Sharing App

## Project Overview
A Shopify app that provides a snippet for sharing product links on social media platforms (WhatsApp, Instagram, Facebook, Twitter, Pinterest, LinkedIn).

## Tech Stack
- **Runtime**: Node.js
- **Frontend**: React with Polaris (Shopify's design system)
- **Backend**: Express.js with Shopify API
- **Theme Extension**: Liquid templates for the sharing snippet

## Project Structure
- `/web` - Main app backend (Node.js/Express)
- `/web/frontend` - React admin dashboard
- `/extensions/social-share-snippet` - Theme app extension with sharing buttons

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `shopify app dev` - Run with Shopify CLI

## Key Features
- Social media sharing buttons for products
- Customizable button styles
- Support for WhatsApp, Facebook, Instagram, Twitter, Pinterest, LinkedIn
- Easy theme integration via app blocks
