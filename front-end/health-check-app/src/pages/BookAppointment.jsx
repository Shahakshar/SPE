import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import appointmentService from '../services/apiService';
import AppointmentRequest from '../models/AppointmentRequest';
import TimeSlotSelector from './TimeSlotSelector';

export default function BookAppointment() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [doctor, setDoctor] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [isNewPatient, setIsNewPatient] = useState(false);

  // Fetch both doctor and user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch doctor details
        const doctorResponse = await appointmentService.getUserById(parseInt(id));
        if (!doctorResponse.data || doctorResponse.data.role !== 'DOCTOR') {
          throw new Error('Invalid doctor ID or doctor not found');
        }
        setDoctor(doctorResponse.data);

        // Fetch current user details (patient)
        const userId = 1; // Replace with actual auth context or route param
        const userResponse = await appointmentService.getUserById(userId);
        if (!userResponse.data) {
          throw new Error('Failed to load user details');
        }
        setCurrentUser(userResponse.data);
        
        // Pre-fill medical history if available
        if (userResponse.data.medicalHistory) {
          setMedicalHistory(userResponse.data.medicalHistory);
        }
        
        // Set new patient status based on role
        setIsNewPatient(userResponse.data.role === 'PATIENT');
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const canProceedToNext = () => {
    switch (step) {
      case 1:
        return selectedDate !== null;
      case 2:
        return selectedTime !== '';
      case 3:
        return symptoms.trim() !== '';
      default:
        return false;
    }
  };

  const handleTimeSelect = (time) => {
    console.log("Selected time slot:", time);
    setSelectedTime(time);
  };

  const handleDateSelect = (date) => {
    console.log("Selected date:", date);
    setSelectedDate(date);
    setSelectedTime('');
  };

  const parseTimeToDateTime = (timeStr, dateObj) => {
    if (!timeStr || !dateObj) {
      console.error("Missing time or date for parsing");
      return null;
    }
    
    try {
      const timeRegex = /(\d+):(\d+)\s+(AM|PM)/i;
      const match = timeStr.match(timeRegex);
      
      if (!match) {
        console.error('Invalid time format:', timeStr);
        return null;
      }
      
      const [_, hours, minutes, period] = match;
      
      let hour = parseInt(hours);
      const isPM = period.toUpperCase() === 'PM';
      
      if (isPM && hour !== 12) hour += 12;
      if (!isPM && hour === 12) hour = 0;
      
      const appointmentDate = new Date(dateObj);
      appointmentDate.setHours(hour, parseInt(minutes), 0, 0);
      
      console.log('Parsed DateTime:', appointmentDate);
      return appointmentDate;
    } catch (error) {
      console.error('Error parsing time:', error);
      return null;
    }
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedTime || !symptoms) {
      toast.error('Please complete all required fields.');
      return;
    }

    setLoading(true);

    try {
      const startDateTime = parseTimeToDateTime(selectedTime, selectedDate);
      
      if (!startDateTime) {
        throw new Error('Failed to parse appointment time correctly');
      }
      
      console.log('Booking appointment with details:', {
        date: selectedDate,
        time: selectedTime,
        parsed: startDateTime
      });

      const appointmentData = new AppointmentRequest({
        doctorId: doctor.id,
        patientId: currentUser.id,
        patientName: currentUser.name,
        patientEmail: currentUser.email,
        patientPhone: currentUser.phone,
        patientAge: currentUser.age,
        patientGender: currentUser.gender,
        patientAddress: currentUser.address,
        serviceId: 1,
        startTime: startDateTime.toISOString(),
        consultationFee: doctor.hourlyRate || doctor.fee,
        reason: symptoms,
        notes: notes,
        duration: 60,
        medicalHistory: medicalHistory || currentUser.medicalHistory,
        newPatient: isNewPatient
      });

      appointmentService.createAppointment(appointmentData)
        .then(response => {
          toast.success('Appointment booked successfully!');
          console.log("Appointment booked:", response.data);
          setTimeout(() => {
            navigate('/');
          }, 1500);
        })
        .catch(error => {
          console.error("Error booking appointment:", error);
          const errorMessage = error.response?.data?.message || 'Failed to book appointment. Please try again.';
          toast.error(errorMessage);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error('Error processing appointment time. Please try again.');
      setLoading(false);
    }
  };

  const renderAppointmentSummary = () => (
    <div className="bg-gray-100 p-4 mt-4 rounded-md text-sm">
      <h4 className="font-medium text-gray-800 mb-2">Appointment Summary</h4>
      <p><strong>Date:</strong> {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Not selected'}</p>
      <p><strong>Time:</strong> {selectedTime || 'Not selected'}</p>
      <p><strong>Doctor:</strong> {doctor.name} ({doctor.expertise || doctor.specialization})</p>
      <p><strong>Patient:</strong> {currentUser?.name}</p>
      <p><strong>Email:</strong> {currentUser?.email}</p>
      <p><strong>Phone:</strong> {currentUser?.phone}</p>
      <p><strong>Age:</strong> {currentUser?.age}</p>
      <p><strong>Gender:</strong> {currentUser?.gender}</p>
      <p><strong>Address:</strong> {currentUser?.address || 'Not provided'}</p>
      <p><strong>Consultation Fee:</strong> ${doctor.hourlyRate || doctor.fee}</p>
      <p><strong>Patient Type:</strong> {isNewPatient ? 'New Patient' : 'Existing Patient'}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-600">Loading appointment details...</p>
        </div>
      </div>
    );
  }

  if (error || !doctor || !currentUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold mb-2">⚠️ Error</p>
          <p>{error || 'Failed to load appointment details'}</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 px-6 py-10 max-w-6xl mx-auto">
      <div className="w-full lg:w-1/2 space-y-8 bg-white p-6 rounded-2xl shadow">
        <div className="flex items-center justify-center gap-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white ${
                step >= s ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            >
              {s}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-2 text-purple-700">📅 Select Date</h2>
            <TimeSlotSelector 
              doctorId={doctor.id}
              onDateSelect={handleDateSelect}
              onTimeSelect={() => {}}
            />
            <button
              onClick={() => setStep(2)}
              disabled={!selectedDate}
              className={`w-full mt-4 px-5 py-2 text-white rounded-lg transition ${
                !selectedDate ? 'bg-purple-300 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              Next →
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-2 text-purple-700">⏰ Select Time Slot</h2>
            <p className="text-sm text-gray-600 mb-4">
              Selected Date: {format(selectedDate, 'MMMM d, yyyy')}
            </p>
            <TimeSlotSelector 
              doctorId={doctor.id}
              onDateSelect={handleDateSelect}
              onTimeSelect={handleTimeSelect}
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!selectedTime}
                className={`px-5 py-2 text-white rounded-lg transition ${
                  !selectedTime ? 'bg-purple-300 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-2 text-purple-700">📝 Appointment Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms <span className="text-red-500">*</span></label>
                <textarea
                  rows={3}
                  className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="Describe your symptoms in detail..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medical History</label>
                <textarea
                  rows={3}
                  className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="Any relevant medical history..."
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                <textarea
                  rows={2}
                  className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="Any additional notes for the doctor..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="newPatient"
                  checked={isNewPatient}
                  onChange={(e) => setIsNewPatient(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="newPatient" className="text-sm text-gray-700">
                  I am a new patient
                </label>
              </div>

              {renderAppointmentSummary()}
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={loading}
              >
                ← Back
              </button>
              <button
                onClick={handleBooking}
                disabled={!canProceedToNext() || loading}
                className={`px-5 py-2 text-white rounded-lg transition ${
                  !canProceedToNext() || loading 
                    ? 'bg-green-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  '✅ Confirm Booking'
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="w-full lg:w-1/2 bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-2xl font-bold text-indigo-700 mb-6">👨‍⚕️ Doctor Details</h3>
        <div className="flex gap-6 items-center">
          <img
            src={doctor.imageUrl || '/default-doctor-image.png'} // Add a default image
            alt={doctor.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-indigo-600"
          />
          <div>
            <p className="text-lg font-semibold text-gray-800">{doctor.name}</p>
            <p className="text-sm text-indigo-500">{doctor.expertise}</p>
            <p className="text-sm text-gray-600">💰 ${doctor.hourlyRate} consultation fee</p>
            <p className="text-sm text-gray-500 mt-2">{doctor.description}</p>
            <p className="text-sm text-gray-600">
              <span className="text-yellow-500">★</span> {doctor.rating.toFixed(1)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}