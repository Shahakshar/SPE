import React from 'react';

export function StatusMessage({ message, isConnected }) {
  return (
    <div className={`mb-4 p-3 rounded-md ${isConnected ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
      <p className="text-center">{message}</p>
    </div>
  );
}