import React from 'react';

export function VideoControls({ toggleMicrophone, toggleCamera, endCall, setMessage, micEnabled, cameraEnabled }) {
  const handleMicToggle = () => {
    const enabled = toggleMicrophone();
    setMessage(enabled ? 'Microphone enabled' : 'Microphone disabled');
  };

  const handleCameraToggle = () => {
    const enabled = toggleCamera();
    setMessage(enabled ? 'Camera enabled' : 'Camera disabled');
  };

  return (
    <div className="flex justify-center gap-6 mt-6">
      <button
        onClick={handleMicToggle}
        className={`w-14 h-14 flex items-center justify-center rounded-full text-white shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white ${
          micEnabled ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
        }`}
        title={micEnabled ? 'Mute microphone' : 'Unmute microphone'}
      >
        {micEnabled ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 1a4 4 0 014 4v6a4 4 0 01-8 0V5a4 4 0 014-4z" />
            <path d="M19 10v2a7 7 0 01-14 0v-2" />
            <path d="M12 19v4" />
            <path d="M8 23h8" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 1a4 4 0 014 4v6a4 4 0 01-8 0V5a4 4 0 014-4z" />
            <path d="M19 10v2a7 7 0 01-14 0v-2" />
            <path d="M12 19v4" />
            <path d="M8 23h8" />
            <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" />
          </svg>
        )}
      </button>

      <button
        onClick={handleCameraToggle}
        className={`w-14 h-14 flex items-center justify-center rounded-full text-white shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white ${
          cameraEnabled ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
        }`}
        title={cameraEnabled ? 'Turn off camera' : 'Turn on camera'}
      >
        {cameraEnabled ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h11a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1z" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h11a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1z" />
            <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" />
          </svg>
        )}
      </button>

      <button
        onClick={endCall}
        className="w-14 h-14 flex items-center justify-center rounded-full bg-red-700 hover:bg-red-800 text-white shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
        title="End consultation"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M22 16.92V19a2 2 0 01-2.18 2A19.8 19.8 0 0112 19a19.8 19.8 0 01-7.82 2A2 2 0 012 19v-2.08a2 2 0 011.45-1.94c2.49-.65 4.69-2.02 6.14-3.9a12.07 12.07 0 014.82 0c1.45 1.88 3.65 3.25 6.14 3.9A2 2 0 0122 16.92z" />
        </svg>
      </button>
    </div>
  );
}
