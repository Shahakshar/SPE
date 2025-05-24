import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Appointment = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
      const storedUser = localStorage.getItem("user");
      // console.log("Stored User:", storedUser);
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser.user);
      }
    }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold">
        Loading profile...
      </div>
    );
  }

  const handleJoinRoom = () => {
    const roomId = '12345';
    const userId = user.id;
    const userName = user.name;

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
