/**
 * MeshCentral Microphone Listen Plugin - Frontend JavaScript
 * Handles microphone enumeration, selection, and audio streaming
 */

class MicrophoneListener {
    constructor() {
        this.mediaStream = null;
        this.audioContext = null;
        this.analyser = null;
        this.microphones = [];
        this.isListening = false;
        
        this.initializeElements();
        this.bindEvents();
        this.loadMicrophones();
    }
    
    initializeElements() {
        this.microphoneSelect = document.getElementById('microphoneSelect');
        this.refreshMicsBtn = document.getElementById('refreshMics');
        this.startListeningBtn = document.getElementById('startListening');
        this.stopListeningBtn = document.getElementById('stopListening');
        this.audioOutput = document.getElementById('audioOutput');
        this.audioInfo = document.getElementById('audioInfo');
        this.volumeMeterContainer = document.getElementById('volumeMeterContainer');
        this.volumeLevel = document.getElementById('volumeLevel');
        this.statusDiv = document.getElementById('status');
    }
    
    bindEvents() {
        this.refreshMicsBtn.addEventListener('click', () => this.loadMicrophones());
        this.startListeningBtn.addEventListener('click', () => this.startListening());
        this.stopListeningBtn.addEventListener('click', () => this.stopListening());
    }
    
    async loadMicrophones() {
        try {
            this.showStatus('Loading microphones...', 'info');
            
            // Request microphone permissions first
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop()); // Stop the temporary stream
            
            // Get all available audio input devices
            const devices = await navigator.mediaDevices.enumerateDevices();
            this.microphones = devices.filter(device => device.kind === 'audioinput');
            
            this.populateMicrophoneSelect();
            this.showStatus(`Found ${this.microphones.length} microphone(s)`, 'success');
            
        } catch (error) {
            console.error('Error loading microphones:', error);
            this.showStatus('Failed to load microphones. Please check permissions.', 'error');
        }
    }
    
    populateMicrophoneSelect() {
        this.microphoneSelect.innerHTML = '';
        
        if (this.microphones.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No microphones found';
            this.microphoneSelect.appendChild(option);
            return;
        }
        
        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select a microphone...';
        this.microphoneSelect.appendChild(defaultOption);
        
        // Add each microphone
        this.microphones.forEach(device => {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.textContent = device.label || `Microphone ${device.deviceId.substr(0, 8)}`;
            this.microphoneSelect.appendChild(option);
        });
    }
    
    async startListening() {
        const selectedDeviceId = this.microphoneSelect.value;
        
        if (!selectedDeviceId) {
            this.showStatus('Please select a microphone first', 'error');
            return;
        }
        
        try {
            this.showStatus('Starting audio stream...', 'info');
            
            // Get audio stream from selected microphone
            const constraints = {
                audio: {
                    deviceId: { exact: selectedDeviceId },
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false
                }
            };
            
            this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            
            // Set up audio context for volume monitoring
            this.setupAudioAnalysis();
            
            // Set up audio output
            this.setupAudioOutput();
            
            // Update UI
            this.isListening = true;
            this.startListeningBtn.disabled = true;
            this.stopListeningBtn.disabled = false;
            this.microphoneSelect.disabled = true;
            this.refreshMicsBtn.disabled = true;
            
            this.volumeMeterContainer.style.display = 'block';
            this.audioOutput.style.display = 'block';
            this.audioInfo.style.display = 'block';
            
            this.showStatus('Listening to microphone...', 'success');
            
            // Start volume monitoring
            this.monitorVolume();
            
        } catch (error) {
            console.error('Error starting audio stream:', error);
            this.showStatus('Failed to start listening. Please check microphone permissions.', 'error');
        }
    }
    
    setupAudioAnalysis() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        
        const source = this.audioContext.createMediaStreamSource(this.mediaStream);
        source.connect(this.analyser);
        
        this.analyser.fftSize = 256;
        this.analyser.smoothingTimeConstant = 0.3;
    }
    
    setupAudioOutput() {
        // Create audio element to play the microphone input
        this.audioOutput.srcObject = this.mediaStream;
        this.audioOutput.play().catch(error => {
            console.warn('Could not auto-play audio:', error);
            this.audioInfo.textContent = 'Click play button to hear the microphone input.';
        });
    }
    
    monitorVolume() {
        if (!this.isListening || !this.analyser) return;
        
        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(dataArray);
        
        // Calculate average volume
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        const volumePercent = (average / 255) * 100;
        
        // Update volume meter
        this.volumeLevel.style.width = `${volumePercent}%`;
        
        // Continue monitoring
        requestAnimationFrame(() => this.monitorVolume());
    }
    
    stopListening() {
        try {
            // Stop all media tracks
            if (this.mediaStream) {
                this.mediaStream.getTracks().forEach(track => track.stop());
                this.mediaStream = null;
            }
            
            // Close audio context
            if (this.audioContext) {
                this.audioContext.close();
                this.audioContext = null;
                this.analyser = null;
            }
            
            // Reset audio output
            this.audioOutput.srcObject = null;
            
            // Update UI
            this.isListening = false;
            this.startListeningBtn.disabled = false;
            this.stopListeningBtn.disabled = true;
            this.microphoneSelect.disabled = false;
            this.refreshMicsBtn.disabled = false;
            
            this.volumeMeterContainer.style.display = 'none';
            this.audioOutput.style.display = 'none';
            this.audioInfo.style.display = 'none';
            
            // Reset volume meter
            this.volumeLevel.style.width = '0%';
            
            this.showStatus('Stopped listening', 'info');
            
        } catch (error) {
            console.error('Error stopping audio stream:', error);
            this.showStatus('Error stopping audio stream', 'error');
        }
    }
    
    showStatus(message, type = 'info') {
        this.statusDiv.textContent = message;
        this.statusDiv.className = `status ${type}`;
        this.statusDiv.style.display = 'block';
        
        // Auto-hide status after 5 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                this.statusDiv.style.display = 'none';
            }, 5000);
        }
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check for required browser APIs
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        document.getElementById('status').textContent = 'Your browser does not support microphone access';
        document.getElementById('status').className = 'status error';
        document.getElementById('status').style.display = 'block';
        return;
    }
    
    // Check for secure context (HTTPS required for microphone access)
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        document.getElementById('status').textContent = 'HTTPS is required for microphone access';
        document.getElementById('status').className = 'status error';
        document.getElementById('status').style.display = 'block';
        return;
    }
    
    // Initialize the microphone listener
    new MicrophoneListener();
});