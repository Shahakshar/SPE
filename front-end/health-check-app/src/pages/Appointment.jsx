import React from 'react';
import { useNavigate } from 'react-router-dom';

const Appointment = () => {
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    const roomId = '12345';
    const userId = 'u001';
    const userName = 'JohnDoe';

    navigate(`/room/${roomId}/${userId}/${userName}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Appointment</h1>
      <button
        onClick={handleJoinRoom}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Join Room
      </button>
    </div>
  );
};

export default Appointment;
