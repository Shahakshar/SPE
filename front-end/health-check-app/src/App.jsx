import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookAppointment from './pages/BookAppointment';
import AppointmentListServ from './component/AppointmentListServ';
import AppointmentDetail from './component/AppointmentDetail';
import Home from './pages/Home';
import Doctors from './pages/Doctors'; 
import Register from './pages/Register';


    // <Router>

    //   <Routes>
    //     <Route path="/" element={<Home />} />
    //     <Route path="/book/:id" element={<BookAppointment />} />
    //     <Route path="/doctors" element={<Doctors />} /> 
    //     <Route path="/Register" element={<Register />} />

    //   </Routes> 

    // </Router>


function App() {
  return (

    <Router>
      {/* <div className="min-h-screen bg-gray-50"> */}
        <Routes>
           <Route path="/" element={<Home />} />
           <Route path="/book/:id" element={<BookAppointment />} />
           <Route path="/doctors" element={<Doctors />} /> 
           <Route path="/Register" element={<Register />} />

          <Route path="/my-appointments" element={<AppointmentListServ />} />
          <Route path="/appointments/:id" element={<AppointmentDetail />} />
        </Routes>
      {/* </div> */}
    </Router>

  );
}

export default App;















// const [joined, setJoined] = useState(false);
// const [roomId, setRoomId] = useState('');
// const [userId] = useState(uuidv4());
// const [userName, setUserName] = useState('');

// const handleJoinRoom = () => {
//   if (!roomId.trim()) {
//     setRoomId(uuidv4().substring(0, 8));
//   }
//   setJoined(true);
// };


// return (
//   <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-4 md:p-8">
//     <div className="max-w-3xl mx-auto">
//       <h1 className="text-3xl md:text-4xl font-bold text-center text-indigo-800 mb-8">
//         Doctor-Patient Video Consultation
//       </h1>
      
//       {!joined ? (
//         <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">
//             Join a Consultation
//           </h2>
//           <p className="text-gray-600 mb-6">
//             Enter an existing room ID to join a consultation, or leave it blank to create a new room.
//           </p>
//           <div className="space-y-4">
//           <input
//               type="text"
//               placeholder="Enter Your Name"
//               value={userName}
//               onChange={(e) => setUserName(e.target.value)}
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
//             />
//             <input
//               type="text"
//               placeholder="Enter room ID or leave blank to create"
//               value={roomId}
//               onChange={(e) => setRoomId(e.target.value)}
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
//             />
//             <button 
//               onClick={handleJoinRoom}
//               className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
//             >
//               Join Consultation
//             </button>
//           </div>
//         </div>
//       ) : (
//         <Room roomId={roomId} userId={userId} userName={userName}/>
//       )}
//     </div>
//   </div>
// );