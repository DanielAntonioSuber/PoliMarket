# PoliMarket Monorepo

This is a monorepo containing both the Backend and Client applications for PoliMarket.

## Project Structure

```
polimarket/
├── Backend/     # Backend application
├── Client/      # Frontend application
├── package.json # Root package.json for workspace configuration
└── README.md    # This file
```

## Getting Started

1. Install dependencies for all workspaces:
```bash
npm run install:all
```

2. Start both applications in development mode:
```bash
npm start
```

Or start them individually:
```bash
# Start only the backend
npm run start:backend

# Start only the client
npm run start:client
```

## Development

- The Backend and Client applications are managed as separate workspaces
- Each workspace has its own package.json and dependencies
- Use the root package.json scripts to manage the entire project
- The `concurrently` package is used to run both applications simultaneously 