# Brad's Playground

A personal collection of tools and utilities, built with React, Tailwind CSS, and Vite.

## Features

- Simple password protection for site access
- Modern, clean UI with Tailwind CSS
- Modular tool architecture for independent development
- GitHub Pages deployment

## Development

### Prerequisites

- Node.js (version 16+)
- npm or yarn

### Setup

1. Clone the repository
   ```
   git clone https://github.com/your-username/brad-playground.git
   cd brad-playground
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Run development server
   ```
   npm run dev
   ```

### Adding New Tools

1. Create a new directory in `src/tools/` for your tool
   ```
   mkdir -p src/tools/your-tool-name
   ```

2. Create your tool's main component
   ```
   touch src/tools/your-tool-name/YourToolName.tsx
   ```

3. Add the tool to the router in `App.tsx` and to the tools list in `Dashboard.tsx`

## Building and Deployment

The site automatically deploys to GitHub Pages when changes are pushed to the main branch.

To build the site manually:

```
npm run build
```

## Password Protection

The site uses a simple client-side password system (stored in the AuthContext). The default password is:

```
mySecretPassword
```

To change this, edit the value in `src/context/AuthContext.tsx`.
