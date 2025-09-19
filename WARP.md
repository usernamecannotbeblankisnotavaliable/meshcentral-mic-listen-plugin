# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a MeshCentral plugin that enables users to select and listen to microphones through a web interface. The plugin integrates with the MeshCentral server ecosystem and provides real-time audio streaming with volume monitoring.

## Common Commands

### Development Setup
```powershell
# Install dependencies
npm install

# Copy plugin to MeshCentral plugins directory (adjust path as needed)
Copy-Item -Recurse -Path . -Destination "C:\path\to\meshcentral\plugins\meshcentral-mic-listen-plugin"
```

### Testing and Development
```powershell
# No automated tests are currently defined - manual browser testing required
# Test by accessing: https://your-meshcentral-server/plugins/meshcentral-mic-listen-plugin/main

# Check plugin is loaded in MeshCentral server logs
# Restart MeshCentral server after code changes to reload plugin
```

## Architecture

### Plugin Structure
- **Backend (`src/plugin.js`)**: MeshCentral plugin handler that:
  - Registers with MeshCentral plugin system via `pluginHandler` function
  - Sets up Express routes for serving static files and main plugin page
  - Handles user authentication and session validation
  - Uses MeshCentral's parent app and Express instance for routing

- **Frontend (`web/` directory)**: Browser-based interface that:
  - Uses Web APIs for microphone access (`navigator.mediaDevices`)
  - Implements real-time audio streaming and volume monitoring
  - Provides device selection and audio controls
  - Requires HTTPS for microphone permissions

### Key Components

#### Plugin Registration (src/plugin.js)
- Exports `pluginHandler` function that MeshCentral calls on startup
- Plugin metadata stored in `obj.info` object
- Routes configured in `setupWebRoutes()` method
- Main route: `/plugins/{pluginname}/main` requires user authentication

#### Frontend Application (web/app.js)
- `MicrophoneListener` class manages entire audio workflow
- Uses `MediaDevices.getUserMedia()` for microphone capture
- Web Audio API (`AudioContext`, `AnalyserNode`) for volume monitoring
- HTML5 Audio element for playback
- Real-time volume visualization with `requestAnimationFrame()`

#### Browser Requirements
- HTTPS required (except localhost) for microphone access
- Modern browser with MediaDevices API support
- Web Audio API support for volume monitoring
- User must grant microphone permissions

### Integration Points
- Plugin integrates with MeshCentral's Express app via `parent.app`
- Uses MeshCentral's session management for authentication
- Static file serving through `parent.express.static()`
- Plugin lifecycle managed by MeshCentral's hook system (`serverStarted`)

### Security Considerations
- Authentication required via MeshCentral sessions
- Microphone access requires explicit user permissions
- No audio data transmitted to servers - all processing client-side
- HTTPS enforcement for secure microphone access

### Development Notes
- Plugin loads on MeshCentral server startup via `serverStarted` hook
- Changes require MeshCentral server restart to reload
- Frontend debugging available through browser developer console
- Volume monitoring uses frequency domain analysis of audio data