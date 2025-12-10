# SocioShare - Shopify Social Sharing App

A Shopify app that adds customizable social media sharing buttons to your product pages. Let customers easily share your products on WhatsApp, Facebook, Twitter/X, Pinterest, LinkedIn, and more!

![SocioShare Preview](https://via.placeholder.com/800x400?text=SocioShare+Preview)

## Features

- 🔗 **Multiple Platforms**: WhatsApp, Facebook, Twitter/X, Pinterest, LinkedIn, Email, Copy Link
- 🎨 **Fully Customizable**: Button size, colors, spacing, and alignment
- 📱 **Responsive Design**: Works on all devices
- ⚡ **Easy Installation**: Add to any product page via Theme Customizer
- 🎯 **Brand Colors**: Automatic platform brand colors or custom colors

## Project Structure

```
SocioShare/
├── extensions/
│   └── social-share-snippet/     # Theme App Extension
│       ├── blocks/
│       │   └── share-buttons.liquid   # Sharing buttons component
│       └── shopify.extension.toml
├── web/
│   ├── frontend/                 # React Admin Dashboard
│   │   ├── src/
│   │   │   ├── App.jsx
│   │   │   └── main.jsx
│   │   ├── index.html
│   │   ├── vite.config.js
│   │   └── package.json
│   ├── index.js                  # Express Backend
│   └── package.json
├── shopify.app.toml              # Shopify App Configuration
└── package.json
```

## Prerequisites

- [Node.js](https://nodejs.org/) v18.20 or higher
- [Shopify CLI](https://shopify.dev/docs/apps/tools/cli) v3.50 or higher
- A [Shopify Partner account](https://partners.shopify.com/)
- A development store

## Installation

### 1. Install Shopify CLI

```bash
npm install -g @shopify/cli@latest
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd web && npm install

# Install frontend dependencies
cd frontend && npm install
```

### 3. Connect to Shopify

```bash
shopify app dev
```

This will:
- Create your app in the Shopify Partners dashboard
- Generate API credentials
- Start the development server

## Development

### Start Development Server

```bash
npm run dev
# or
shopify app dev
```

### Build for Production

```bash
npm run build
```

### Deploy to Shopify

```bash
npm run deploy
# or
shopify app deploy
```

## Adding Sharing Buttons to Your Store

1. Go to **Online Store → Themes** in your Shopify admin
2. Click **Customize** on your active theme
3. Navigate to a **Product page**
4. Click **Add block** in the product section
5. Select **SocioShare Buttons**
6. Configure the button settings:
   - Choose which platforms to display
   - Adjust button size and styling
   - Set alignment and spacing
7. Click **Save**

## Customization Options

| Setting | Description |
|---------|-------------|
| **Platforms** | Toggle individual social platforms |
| **Button Size** | 32px - 64px |
| **Icon Size** | 14px - 32px |
| **Border Radius** | 0% - 50% (square to circle) |
| **Button Gap** | 4px - 24px spacing between buttons |
| **Brand Colors** | Use official platform colors or custom |
| **Alignment** | Left, Center, or Right |
| **Label** | Optional "Share:" label with custom text |

## Supported Platforms

| Platform | Features |
|----------|----------|
| **WhatsApp** | Opens WhatsApp with product title and link |
| **Facebook** | Opens Facebook share dialog |
| **Twitter/X** | Tweet with product title and link |
| **Pinterest** | Pin with product image and description |
| **LinkedIn** | Share to LinkedIn feed |
| **Email** | Compose email with product details |
| **Copy Link** | Copy product URL to clipboard |

## Tech Stack

- **Frontend**: React 18 + Vite + Shopify Polaris
- **Backend**: Node.js + Express + Shopify API
- **Theme Extension**: Liquid templates
- **Authentication**: Shopify OAuth

## Configuration

The app configuration is in `shopify.app.toml`:

```toml
name = "SocioShare"
application_url = "https://localhost:3000"
embedded = true

[access_scopes]
scopes = "read_products"
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/products` | GET | Fetch store products |
| `/api/settings` | GET | Get app settings |
| `/api/settings` | POST | Save app settings |

## Troubleshooting

### App Not Loading

1. Ensure Shopify CLI is updated: `npm install -g @shopify/cli@latest`
2. Clear browser cache and cookies
3. Restart development server: `shopify app dev`

### Extension Not Appearing

1. Ensure the app is installed on your development store
2. Check that the extension is deployed: `shopify app deploy`
3. Refresh the theme customizer

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues or questions, please [open an issue](https://github.com/yourusername/socioshare/issues) on GitHub.
