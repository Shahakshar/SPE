import { useState, useEffect } from 'react';
import { Calendar, Clock, FileText, ChevronRight, AlertCircle, User, Stethoscope } from 'lucide-react';
import appointmentService from '../services/apiService';

const AppointmentListServ = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('upcoming'); // 'upcoming', 'past', 'all'
  
  // Mocked user for demonstration
  // In a real application, you would get this from your auth context
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Get user from localStorage
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          throw new Error('User not logged in');
        }

        const parsedUser = JSON.parse(storedUser);
        // console.log("User from localStorage:", parsedUser.user);

        // Fetch complete user details using ID from localStorage
        const userResponse = await appointmentService.getUserById(parsedUser.user.id);
        if (!userResponse.data) {
          throw new Error('Failed to load user details');
        }
        setUser(userResponse.data);

      } catch (err) {
        console.error('Failed to fetch user info:', err);
        setError('Failed to load user information');
        if (err.message === 'User not logged in') {
          // Redirect to login if user is not authenticated
          window.location.href = '/login';
        }
      }
    };
    
    fetchUserInfo();
  }, []);
  
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user || !user.id) return;
      
      try {
        setLoading(true);
        let response;
        
        // Use different API endpoints based on user role and filter
        if (user.role === 'DOCTOR') {
          switch (filter) {
            case 'upcoming':
              response = await appointmentService.getUpcomingAppointmentsForDoctor(user.id);
              break;
            case 'all':
              response = await appointmentService.getAllFutureAppointmentsForDoctor(user.id);
              break;
            case 'past':
              response = await appointmentService.getAppointmentsByDoctor(user.id);
              break;
            default:
              response = await appointmentService.getUpcomingAppointmentsForDoctor(user.id);
          }
        } else { // PATIENT
          switch (filter) {
            case 'upcoming':
              response = await appointmentService.getUpcomingAppointmentsForPatient(user.id);
              break;
            case 'all':
              response = await appointmentService.getAllFutureAppointmentsForPatient(user.id);
              break;
            case 'past':
              response = await appointmentService.getAppointmentsByPatient(user.id);
              break;
            default:
              response = await appointmentService.getUpcomingAppointmentsForPatient(user.id);
          }
        }
        
        // Sort appointments by date (newest first)
        const sortedAppointments = response.data.sort((a, b) => 
          new Date(a.startTime) - new Date(b.startTime)
        );
        
        setAppointments(sortedAppointments);
        setLoading(false);
      } catch (err) {
        setError('Failed to load appointments');
        setLoading(false);
        console.error(err);
      }
    };
    
    if (user) {
      fetchAppointments();
    }
  }, [user, filter]);
  
  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
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
  
  const getStatusIcon = (status) => {
    switch(status) {
      case 'PENDING': return <Clock size={16} />;
      case 'COMPLETED': return <span className="rounded-full h-4 w-4 bg-green-600 flex items-center justify-center text-white">✓</span>;
      case 'CANCELLED': return <span className="rounded-full h-4 w-4 bg-red-600 flex items-center justify-center text-white">×</span>;
      default: return <AlertCircle size={16} />;
    }
  };
  
  const isUpcoming = (appointment) => {
    const now = new Date();
    const appointmentTime = new Date(appointment.startTime);
    return appointmentTime > now;
  };
  
  const filteredAppointments = () => {
    switch(filter) {
      case 'upcoming':
        return appointments.filter(appointment => isUpcoming(appointment));
      case 'past':
        return appointments.filter(appointment => !isUpcoming(appointment));
      default:
        return appointments;
    }
  };
  
  const navigateToAppointmentDetail = (appointmentId) => {
    // In a real app, use router navigation
    window.location.href = `/appointments/${appointmentId}`;
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-red-500">{error}</h2>
        <p className="mt-2 text-gray-600">Please try again later</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto p-4 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {user?.role === 'DOCTOR' ? 'My Patient Appointments' : 'My Appointments'}
        </h1>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex">
          <button 
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              filter === 'upcoming' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Upcoming
          </button>
          <button 
            onClick={() => setFilter('past')}
            className={`px-4 py-2 text-sm font-medium ${
              filter === 'past' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Past
          </button>
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            All
          </button>
        </div>
      </div>
      
      {filteredAppointments().length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-medium text-gray-600">No appointments found</h2>
          <p className="mt-2 text-gray-500">
            {filter === 'upcoming' 
              ? "You don't have any upcoming appointments scheduled." 
              : filter === 'past' 
                ? "You don't have any past appointments." 
                : "You don't have any appointments scheduled."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredAppointments().map(appointment => (
            <div 
              key={appointment.id}
              onClick={() => navigateToAppointmentDetail(appointment.id)}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 overflow-hidden block cursor-pointer"
            >
              <div className="flex flex-col md:flex-row">
                <div className="bg-blue-100 p-4 md:p-6 flex items-center justify-center md:w-48">
                  <div className="text-center">
                    <div className="text-sm text-blue-600 font-medium">
                      {formatDate(appointment.startTime)}
                    </div>
                    <div className="text-xl font-bold text-blue-800 mt-1">
                      {formatTime(appointment.startTime)}
                    </div>
                  </div>
                </div>
                <div className="p-4 md:p-6 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{appointment.reason}</h3>
                      
                      {user?.role === 'DOCTOR' ? (
                        // Show patient info for doctors
                        <div className="flex items-center text-gray-600 mt-2">
                          <User size={16} className="mr-1" />
                          <span>{appointment.patientName || "Patient"}</span>
                        </div>
                      ) : (
                        // Show doctor info for patients
                        <div className="flex items-center text-gray-600 mt-2">
                          <User size={16} className="mr-1" />
                          <span>Dr. {appointment.doctorName || "Smith"}</span>
                        </div>
                      )}
                      
                      {/* Service info */}
                      <div className="flex items-center text-gray-600 mt-1">
                        <Stethoscope size={16} className="mr-1" />
                        <span>{appointment.serviceName || "Medical Consultation"}</span>
                      </div>
                      
                      <div className="text-gray-600 mt-2">{appointment.notes || "No additional notes"}</div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm flex items-center ${getStatusColor(appointment.status)}`}>
                      {getStatusIcon(appointment.status)}
                      <span className="ml-1">{appointment.status}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-gray-500 text-sm">
                      Consultation Fee: <span className="font-medium">${appointment.consultationFee?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex items-center text-blue-600">
                      View Details <ChevronRight size={16} className="ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentListServ;