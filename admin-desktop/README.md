
# HOUSIE Admin Desktop

A standalone Electron desktop application for HOUSIE emergency controls management.

## Features

- **No Authentication Required** - Direct service role access for immediate emergency response
- **Complete Emergency Controls** - AI Controls, Platform Controls, Security Controls, Communication Controls
- **Professional Desktop UI** - Native window controls, system tray, keyboard shortcuts
- **Cross-Platform** - Windows, macOS, and Linux support
- **Secure Configuration** - Encrypted storage of Supabase service role keys
- **Real-time Updates** - Auto-refresh controls and desktop notifications

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase project with admin access

### Installation

1. Clone or download this admin-desktop folder
2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Configure your Supabase connection:
   - Enter your Supabase URL: `https://your-project.supabase.co`
   - Enter your Service Role Key (starts with `eyJ...`)

### Building for Production

Build for your platform:
```bash
# Windows
npm run build:win

# macOS  
npm run build:mac

# Linux
npm run build:linux

# All platforms
npm run build:all
```

Built applications will be in the `dist-electron/` folder.

## Emergency Controls

### AI Controls
- **Claude API Emergency Disable** - Immediately disable all Claude AI access platform-wide
- **Block Claude Access** - Prevent user access to Claude AI features

### Platform Controls
- **Pause All Bookings** - Stop new booking creation
- **Maintenance Mode** - Display maintenance message to users
- **Block New Registrations** - Prevent new account creation
- **Force User Logout** - Immediately log out all platform users

### Security Controls
- **Fraud Lockdown** - Block high-risk transactions and activities
- **Manual Review All Bookings** - Require admin approval for bookings
- **Geographic Blocking** - Block access from high-risk countries
- **Payment Restrictions** - Limit allowed payment methods

### Communication Controls
- **Disable Messaging** - Block platform messaging between users
- **Provider Broadcast** - Emergency communication system for providers

### Recovery Tools
- **Emergency Database Backup** - Trigger immediate backup of critical data
- **System Health Monitor** - Real-time status of platform components

## Keyboard Shortcuts

- `Ctrl+Shift+C` (Cmd+Shift+C on Mac) - Emergency Disable Claude
- `Ctrl+Shift+B` (Cmd+Shift+B on Mac) - Pause All Bookings  
- `Ctrl+Shift+F` (Cmd+Shift+F on Mac) - Fraud Lockdown
- `Ctrl+Shift+R` (Cmd+Shift+R on Mac) - Restore Normal Operations
- `Ctrl+R` (Cmd+R on Mac) - Refresh Controls

## System Tray

The app runs in the system tray with quick access to:
- Show/Hide main window
- Emergency control shortcuts
- Real-time status indicators

## Security

- **Encrypted Storage** - Service role keys stored encrypted locally
- **Secure IPC** - Communication between main/renderer processes
- **No Remote Access** - Runs completely offline after configuration
- **Audit Logging** - All actions logged to Supabase admin_actions table

## Configuration

The app securely stores:
- Supabase URL
- Service Role Key (encrypted)
- Window preferences
- Last known control states

Configuration is stored in:
- **Windows**: `%APPDATA%/housie-admin-desktop/`
- **macOS**: `~/Library/Application Support/housie-admin-desktop/`
- **Linux**: `~/.config/housie-admin-desktop/`

## Troubleshooting

### Connection Issues
1. Verify Supabase URL format: `https://your-project.supabase.co`
2. Ensure Service Role Key is correct (starts with `eyJ`)
3. Check network connectivity
4. Verify Supabase project is active

### Permission Issues
1. Ensure Service Role Key has admin privileges
2. Check RLS policies allow emergency_controls access
3. Verify emergency control functions exist in database

### Build Issues
1. Ensure Node.js 18+ is installed
2. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
3. Check platform-specific requirements in electron-builder docs

## Development

### Project Structure
```
admin-desktop/
├── electron/          # Electron main process
├── src/              # React renderer process
├── public/           # Static assets
└── build/            # Platform build configs
```

### Adding New Controls
1. Update `EmergencyControlsState` interface in `types/emergencyControls.ts`
2. Add control logic to `EmergencyControlsService`
3. Add UI component to `EmergencyControlsDashboard`
4. Update keyboard shortcuts in `electron/main.js`

## Support

For issues with the desktop app, check:
1. Main HOUSIE platform database connectivity
2. Supabase emergency_controls table structure
3. Service role key permissions
4. Desktop app logs in DevTools (Ctrl+Shift+I)
