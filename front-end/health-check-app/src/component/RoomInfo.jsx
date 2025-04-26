import React from 'react';

export function RoomInfo({ roomId }) {
  return (
    <div className="mt-4 mb-4 p-2 bg-gray-100 rounded-md">
      <p className="text-center text-gray-700">
        Room ID: <span className="font-semibold">{roomId}</span>
      </p>
    </div>
  );
}