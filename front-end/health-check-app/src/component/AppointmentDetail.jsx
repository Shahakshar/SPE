// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Calendar, Clock, User, Stethoscope, Phone, Mail, AlertCircle, ArrowLeft, Video } from 'lucide-react';
// import appointmentService from '../services/apiService';

// const AppointmentDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [appointment, setAppointment] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   useEffect(() => {
//     const fetchAppointmentDetail = async () => {
//       try {
//         setLoading(true);
//         console.log(id);
//         const response = await appointmentService.getAppointmentById(id);
//         console.log(response.data);
//         setAppointment(response.data);
//         setLoading(false);
//       } catch (err) {
//         setError('Failed to load appointment details');
//         setLoading(false);
//         console.error(err);
//       }
//     };
    
//     fetchAppointmentDetail();
//   }, [id]);
  
//   const formatDate = (dateTimeString) => {
//     const date = new Date(dateTimeString);
//     return new Intl.DateTimeFormat('en-US', {
//       weekday: 'long',
//       month: 'long',
//       day: 'numeric',
//       year: 'numeric'
//     }).format(date);
//   };
  
//   const formatTime = (dateTimeString) => {
//     const date = new Date(dateTimeString);
//     return new Intl.DateTimeFormat('en-US', {
//       hour: 'numeric',
//       minute: '2-digit',
//       hour12: true
//     }).format(date);
//   };
  
//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'PENDING': return 'bg-blue-100 text-blue-600';
//       case 'COMPLETED': return 'bg-green-100 text-green-600';
//       case 'CANCELLED': return 'bg-red-100 text-red-600';
//       default: return 'bg-gray-100 text-gray-600';
//     }
//   };
  
//   const handleJoinMeeting = () => {
//     if (appointment && appointment.meetingRoomId) {
//       console.log('Meeting Room ID:', appointment.meetingRoomId);
//       // Here you would typically redirect to the video meeting page
//       // navigate(`/meeting/${appointment.meetingRoomId}`);
//     }
//   };
  
//   const isPending = (appointment) => {
//     return appointment && appointment.status === 'PENDING';
//   };
  
//   const isUpcoming = (appointment) => {
//     if (!appointment) return false;
//     const now = new Date();
//     const appointmentTime = new Date(appointment.startTime);
//     return appointmentTime > now;
//   };
  
//   const canJoinMeeting = (appointment) => {
//     if (!appointment || appointment.status !== 'PENDING') return false;
    
//     const now = new Date();
//     const startTime = new Date(appointment.startTime);
//     const endTime = new Date(appointment.endTime);
    
//     // Allow joining 5 minutes before start time
//     const joinWindowStart = new Date(startTime);
//     joinWindowStart.setMinutes(joinWindowStart.getMinutes() - 5);
    
//     return now >= joinWindowStart && now <= endTime;
//   };
  
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }
  
//   if (error || !appointment) {
//     return (
//       <div className="text-center py-8">
//         <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
//         <h2 className="text-2xl font-bold text-red-500">{error || 'Appointment not found'}</h2>
//         <p className="mt-2 text-gray-600">Please try again later</p>
//         <button 
//           onClick={() => navigate('/appointments')}
//           className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center mx-auto"
//         >
//           <ArrowLeft size={16} className="mr-2" /> Back to Appointments
//         </button>
//       </div>
//     );
//   }
  
//   return (
//     <div className="max-w-4xl mx-auto p-4 pb-20">
//       <button 
//         onClick={() => navigate('/appointments')}
//         className="mb-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center w-fit"
//       >
//         <ArrowLeft size={16} className="mr-2" /> Back to Appointments
//       </button>
      
//       <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//         {/* Header */}
//         <div className="bg-blue-600 text-white p-6">
//           <div className="flex justify-between items-start">
//             <div>
//               <h1 className="text-2xl font-bold">{appointment.reason}</h1>
//               <div className="mt-2 flex items-center">
//                 <Calendar size={18} className="mr-2" />
//                 <span>{formatDate(appointment.startTime)}</span>
//               </div>
//               <div className="mt-1 flex items-center">
//                 <Clock size={18} className="mr-2" />
//                 <span>{formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}</span>
//               </div>
//             </div>
//             <div className={`px-4 py-2 rounded-full text-sm font-medium ${
//               appointment.status === 'PENDING' ? 'bg-white text-blue-600' :
//               appointment.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
//               'bg-red-100 text-red-700'
//             }`}>
//               {appointment.status}
//             </div>
//           </div>
//         </div>
        
//         {/* Content */}
//         <div className="p-6">
//           {/* Doctor Info */}
//           <div className="mb-8">
//             <h2 className="text-lg font-semibold mb-3 text-gray-800">Doctor Information</h2>
//             <div className="bg-gray-50 rounded-lg p-4">
//               <div className="flex items-center">
//                 <User size={20} className="text-blue-600 mr-3" />
//                 <div>
//                   <div className="font-medium">Dr. {appointment.doctorName || "Smith"}</div>
//                   <div className="text-gray-500 text-sm">{appointment.doctorSpecialty || "General Practitioner"}</div>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           {/* Service Info */}
//           <div className="mb-8">
//             <h2 className="text-lg font-semibold mb-3 text-gray-800">Service Information</h2>
//             <div className="bg-gray-50 rounded-lg p-4">
//               <div className="flex items-center">
//                 <Stethoscope size={20} className="text-blue-600 mr-3" />
//                 <div>
//                   <div className="font-medium">{appointment.serviceName || "Medical Consultation"}</div>
//                   <div className="text-gray-500 text-sm">Consultation Fee: ${appointment.consultationFee.toFixed(2)}</div>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           {/* Patient Info */}
//           <div className="mb-8">
//             <h2 className="text-lg font-semibold mb-3 text-gray-800">Patient Information</h2>
//             <div className="bg-gray-50 rounded-lg p-4 grid md:grid-cols-2 gap-4">
//               <div className="flex items-center">
//                 <User size={20} className="text-blue-600 mr-3" />
//                 <div>
//                   <div className="text-gray-500 text-sm">Name</div>
//                   <div className="font-medium">{appointment.patientName}</div>
//                 </div>
//               </div>
//               <div className="flex items-center">
//                 <Mail size={20} className="text-blue-600 mr-3" />
//                 <div>
//                   <div className="text-gray-500 text-sm">Email</div>
//                   <div className="font-medium">{appointment.patientEmail}</div>
//                 </div>
//               </div>
//               <div className="flex items-center">
//                 <Phone size={20} className="text-blue-600 mr-3" />
//                 <div>
//                   <div className="text-gray-500 text-sm">Phone</div>
//                   <div className="font-medium">{appointment.patientPhone}</div>
//                 </div>
//               </div>
//               <div className="flex items-center">
//                 <Clock size={20} className="text-blue-600 mr-3" />
//                 <div>
//                   <div className="text-gray-500 text-sm">Age</div>
//                   <div className="font-medium">{appointment.patientAge}</div>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           {/* Notes */}
//           {appointment.notes && (
//             <div className="mb-8">
//               <h2 className="text-lg font-semibold mb-3 text-gray-800">Notes</h2>
//               <div className="bg-gray-50 rounded-lg p-4">
//                 <p className="text-gray-700">{appointment.notes}</p>
//               </div>
//             </div>
//           )}
          
//           {/* Join Meeting Button - Only show for pending and upcoming appointments */}
//           {isPending(appointment) && isUpcoming(appointment) && (
//             <div className="mt-8">
//               <button
//                 onClick={handleJoinMeeting}
//                 disabled={!canJoinMeeting(appointment)}
//                 className={`w-full py-3 rounded-lg flex items-center justify-center font-medium ${
//                   canJoinMeeting(appointment)
//                     ? 'bg-green-600 text-white hover:bg-green-700'
//                     : 'bg-gray-200 text-gray-500 cursor-not-allowed'
//                 }`}
//               >
//                 <Video size={20} className="mr-2" />
//                 {canJoinMeeting(appointment)
//                   ? 'Join Video Consultation'
//                   : 'Video consultation will be available 5 minutes before the appointment'}
//               </button>
//               {!canJoinMeeting(appointment) && isPending(appointment) && (
//                 <p className="text-sm text-center text-gray-500 mt-2">
//                   You can join the meeting 5 minutes before the scheduled time
//                 </p>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AppointmentDetail;


import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Stethoscope, Phone, Mail, AlertCircle, ArrowLeft, Video } from 'lucide-react';
import appointmentService from '../services/apiService';

const AppointmentDetail = () => {
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  
  const getAppointmentIdFromUrl = () => {
    const pathSegments = window.location.pathname.split('/');
    return pathSegments[pathSegments.indexOf('appointment') + 1];
  };
  
  useEffect(() => {
    // Fetch user info first
    const fetchUserInfo = async () => {
      try {
        // This should come from your auth context in a real app
        const userId = localStorage.getItem('userId') || 1; // Default ID if not found
        const userResponse = await appointmentService.getUserById(userId);
        setUser(userResponse.data);
      } catch (err) {
        console.error('Failed to fetch user info:', err);
        setError('Failed to load user information');
      }
    };
    
    fetchUserInfo();
  }, []);
  
  useEffect(() => {
    const fetchAppointmentDetail = async () => {
      if (!user) return;
      
      const id = getAppointmentIdFromUrl();
      if (!id) {
        setError('Invalid appointment ID');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await appointmentService.getAppointmentById(id);
        setAppointment(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load appointment details');
        setLoading(false);
        console.error(err);
      }
    };
    
    if (user) {
      fetchAppointmentDetail();
    }
  }, [user]);
  
  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return 'bg-blue-100 text-blue-600';
      case 'COMPLETED': return 'bg-green-100 text-green-600';
      case 'CANCELLED': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };
  
  const handleJoinMeeting = () => {
    if (appointment && appointment.meetingRoomId) {
      console.log('Meeting Room ID:', appointment.meetingRoomId);
      // Here you would typically redirect to the video meeting page
      window.location.href = `/room/${appointment.meetingRoomId}/${user.id}/${user.name}`;
    }
  };
  
  const isPending = (appointment) => {
    return appointment && appointment.status === 'PENDING';
  };
  
  const isUpcoming = (appointment) => {
    if (!appointment) return false;
    const now = new Date();
    const appointmentTime = new Date(appointment.startTime);
    return appointmentTime > now;
  };
  
  const canJoinMeeting = (appointment) => {
    if (!appointment || appointment.status !== 'PENDING') return false;
    
    const now = new Date();
    const startTime = new Date(appointment.startTime);
    const endTime = new Date(appointment.endTime);
    
    // Allow joining 5 minutes before start time
    const joinWindowStart = new Date(startTime);
    joinWindowStart.setMinutes(joinWindowStart.getMinutes() - 5);
    
    return now >= joinWindowStart && now <= endTime;
  };
  
  const goBack = () => {
    // In a real app, use router.back()
    window.history.back();
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error || !appointment) {
    return (
      <div className="text-center py-8">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-red-500">{error || 'Appointment not found'}</h2>
        <p className="mt-2 text-gray-600">Please try again later</p>
        <button 
          onClick={goBack}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center mx-auto"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to Appointments
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto p-4 pb-20">
      <button 
        onClick={goBack}
        className="mb-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center w-fit"
      >
        <ArrowLeft size={16} className="mr-2" /> Back to Appointments
      </button>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{appointment.reason}</h1>
              <div className="mt-2 flex items-center">
                <Calendar size={18} className="mr-2" />
                <span>{formatDate(appointment.startTime)}</span>
              </div>
              <div className="mt-1 flex items-center">
                <Clock size={18} className="mr-2" />
                <span>{formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}</span>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${
              appointment.status === 'PENDING' ? 'bg-white text-blue-600' :
              appointment.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
              'bg-red-100 text-red-700'
            }`}>
              {appointment.status}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {user?.role === 'DOCTOR' ? (
            // Doctor's view shows patient info first
            <>
              {/* Patient Info */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">Patient Information</h2>
                <div className="bg-gray-50 rounded-lg p-4 grid md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <User size={20} className="text-blue-600 mr-3" />
                    <div>
                      <div className="text-gray-500 text-sm">Name</div>
                      <div className="font-medium">{appointment.patientName}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail size={20} className="text-blue-600 mr-3" />
                    <div>
                      <div className="text-gray-500 text-sm">Email</div>
                      <div className="font-medium">{appointment.patientEmail}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone size={20} className="text-blue-600 mr-3" />
                    <div>
                      <div className="text-gray-500 text-sm">Phone</div>
                      <div className="font-medium">{appointment.patientPhone}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock size={20} className="text-blue-600 mr-3" />
                    <div>
                      <div className="text-gray-500 text-sm">Age</div>
                      <div className="font-medium">{appointment.patientAge}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Service Info */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">Service Information</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Stethoscope size={20} className="text-blue-600 mr-3" />
                    <div>
                      <div className="font-medium">{appointment.serviceName || "Medical Consultation"}</div>
                      <div className="text-gray-500 text-sm">Consultation Fee: ${appointment.consultationFee?.toFixed(2) || '0.00'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Patient's view shows doctor info first
            <>
              {/* Doctor Info */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">Doctor Information</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <User size={20} className="text-blue-600 mr-3" />
                    <div>
                      <div className="font-medium">Dr. {appointment.doctorName || "Smith"}</div>
                      <div className="text-gray-500 text-sm">{appointment.doctorSpecialty || "General Practitioner"}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Service Info */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">Service Information</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Stethoscope size={20} className="text-blue-600 mr-3" />
                    <div>
                      <div className="font-medium">{appointment.serviceName || "Medical Consultation"}</div>
                      <div className="text-gray-500 text-sm">Consultation Fee: ${appointment.consultationFee?.toFixed(2) || '0.00'}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Patient Info - simplified for patient's own view */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">Your Information</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <User size={20} className="text-blue-600 mr-3" />
                    <div>
                      <div className="font-medium">{appointment.patientName}</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {/* Notes */}
          {appointment.notes && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3 text-gray-800">Notes</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">{appointment.notes}</p>
              </div>
            </div>
          )}
          
          {/* Join Meeting Button - Only show for pending and upcoming appointments */}
          {isPending(appointment) && isUpcoming(appointment) && (
            <div className="mt-8">
              <button
                onClick={handleJoinMeeting}
                disabled={!canJoinMeeting(appointment)}
                className={`w-full py-3 rounded-lg flex items-center justify-center font-medium ${
                  canJoinMeeting(appointment)
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Video size={20} className="mr-2" />
                {canJoinMeeting(appointment)
                  ? 'Join Video Consultation'
                  : 'Video consultation will be available 5 minutes before the appointment'}
              </button>
              {!canJoinMeeting(appointment) && isPending(appointment) && (
                <p className="text-sm text-center text-gray-500 mt-2">
                  You can join the meeting 5 minutes before the scheduled time
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetail;