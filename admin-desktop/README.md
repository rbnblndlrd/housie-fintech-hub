
# Housie Admin Desktop Application

A standalone Electron desktop application for the Housie Admin Dashboard.

## Setup

1. Navigate to the admin-desktop folder:
```bash
cd admin-desktop
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables by creating a `.env` file with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Development

Run the desktop app in development mode:
```bash
npm run dev
```

## Building

Build the desktop app for distribution:
```bash
npm run build
```

Pack the app (without creating installer):
```bash
npm run pack
```

## Features

- Native desktop application
- Admin dashboard functionality
- Cross-platform support (Windows, macOS, Linux)
- Secure IPC communication
- Auto-updater ready
