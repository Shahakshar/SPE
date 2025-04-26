import React from 'react';

export function VideoDisplay({ localVideoRef, remoteVideoRef, micEnabled, cameraEnabled }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl px-4 py-6 mx-auto">
      <div className="relative bg-black rounded-2xl shadow-xl aspect-video overflow-hidden">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-3 left-3 bg-gray-800 bg-opacity-70 text-white text-xs md:text-sm px-3 py-1 rounded-md">
          You {!cameraEnabled && '(Camera Off)'} {!micEnabled && '(Mic Off)'}
        </div>
      </div>

      <div className="relative bg-black rounded-2xl shadow-xl aspect-video overflow-hidden">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-3 left-3 bg-gray-800 bg-opacity-70 text-white text-xs md:text-sm px-3 py-1 rounded-md">
          Doctor
        </div>
      </div>
    </div>
  );
}
