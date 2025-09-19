# MeshCentral Microphone Listen Plugin

A MeshCentral plugin that allows users to select and listen to microphones through a web interface.

## Features

- 🎤 **Microphone Enumeration**: Automatically discover and list available audio input devices
- 🔊 **Real-time Audio Streaming**: Stream microphone audio directly in the browser
- 📊 **Volume Monitoring**: Visual volume level indicator with real-time feedback
- 🎛️ **Device Selection**: Choose from multiple available microphones
- 🔒 **Secure**: Requires HTTPS and explicit user permissions for microphone access

## Installation

### Prerequisites

- MeshCentral server running
- Node.js installed
- HTTPS enabled (required for microphone access)

### Install Plugin

1. Copy the plugin directory to your MeshCentral plugins folder:
   ```bash
   cp -r meshcentral-mic-listen-plugin /path/to/meshcentral/plugins/
   ```

2. Install dependencies:
   ```bash
   cd /path/to/meshcentral/plugins/meshcentral-mic-listen-plugin
   npm install
   ```

3. Restart your MeshCentral server to load the plugin.

## Usage

### Accessing the Plugin

1. Log in to your MeshCentral web interface
2. Navigate to: `/plugins/meshcentral-mic-listen-plugin/main`
3. Grant microphone permissions when prompted by the browser

### Using the Interface

#### 1. Select Microphone
- The plugin automatically enumerates available microphones
- Select your desired microphone from the dropdown menu
- Click "Refresh Microphones" to re-scan for devices

#### 2. Start Listening
- Click "Start Listening" to begin capturing audio from the selected microphone
- The volume meter will show real-time input levels
- Audio will be played back through your speakers/headphones

#### 3. Monitor Audio
- Watch the volume level indicator for input activity
- Use the audio controls to adjust playback
- The interface shows current status and any errors

#### 4. Stop Listening
- Click "Stop Listening" to end the audio stream
- This will stop microphone access and audio playback

## Browser Requirements

- **Modern Browser**: Chrome, Firefox, Safari, or Edge
- **HTTPS**: Secure connection required (except for localhost)
- **Microphone Permissions**: User must grant microphone access
- **Web Audio API**: Required for volume monitoring and audio processing

## Security Considerations

- Microphone access requires explicit user permission
- Plugin respects browser security policies
- No audio data is stored or transmitted to external servers
- Audio streaming is handled entirely within the browser

## Technical Details

### Plugin Architecture

```
meshcentral-mic-listen-plugin/
├── package.json              # Project metadata and dependencies
├── src/
│   └── plugin.js             # MeshCentral plugin backend
└── web/                      # Frontend web interface
    ├── index.html            # Main UI
    └── app.js               # JavaScript application logic
```

### Backend (plugin.js)
- Registers with MeshCentral plugin system
- Sets up Express routes for web interface
- Serves static files from web directory
- Handles user authentication

### Frontend (web/)
- **index.html**: Clean, responsive UI with microphone controls
- **app.js**: JavaScript class managing:
  - Microphone enumeration using `navigator.mediaDevices`
  - Audio stream capture with `getUserMedia()`
  - Real-time volume analysis with Web Audio API
  - Audio playback and UI state management

### Web APIs Used
- **MediaDevices.getUserMedia()**: Capture microphone audio
- **MediaDevices.enumerateDevices()**: List available microphones
- **Web Audio API**: Analyze audio levels and process streams
- **HTML5 Audio Element**: Playback captured audio

## Troubleshooting

### Common Issues

**"No microphones found"**
- Ensure microphones are connected and recognized by the system
- Check browser permissions for microphone access
- Try refreshing the microphone list

**"HTTPS is required for microphone access"**
- Microphone access requires a secure connection
- Use HTTPS or access via localhost for development

**"Your browser does not support microphone access"**
- Update to a modern browser version
- Ensure JavaScript is enabled

**Audio feedback/echo**
- Use headphones to prevent speaker feedback
- Adjust microphone and speaker positioning
- Consider enabling echo cancellation in advanced settings

### Debug Mode

Check browser developer console for detailed error messages:
1. Press F12 to open developer tools
2. Go to Console tab
3. Look for error messages when using the plugin

## Development

### Project Structure
- `src/plugin.js`: MeshCentral plugin entry point
- `web/index.html`: Main user interface
- `web/app.js`: Frontend application logic
- `package.json`: Dependencies and metadata

### Building/Testing
1. Make changes to source files
2. Restart MeshCentral server to reload plugin
3. Test in browser with HTTPS enabled

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License - see package.json for details.

## Support

For issues or questions:
1. Check browser console for error messages
2. Verify HTTPS and microphone permissions
3. Ensure MeshCentral server is running properly
4. Check MeshCentral logs for plugin loading errors