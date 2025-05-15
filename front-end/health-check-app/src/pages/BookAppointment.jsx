import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, parse, setHours, setMinutes } from 'date-fns';
import { doctors } from '../data/doctors';
import toast from 'react-hot-toast';
import appointmentService from '../services/apiService';
import AppointmentRequest from '../models/AppointmentRequest';

const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];

const currentUser = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "123-456-7890",
  age: 30,
  gender: "Male",
  address: "123 Main St, Anytown, USA"
};

export default function BookAppointment() {
  const { id } = useParams();
  // const navigate = useNavigate();
  const doctor = doctors.find((d) => d.id === parseInt(id));

  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState(timeSlots);
  const [notes, setNotes] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [isNewPatient, setIsNewPatient] = useState(false);

  // Check for booked appointments when date changes
  useEffect(() => {
    if (selectedDate && doctor) {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      setLoading(true);
      
      // Get booked appointments for the selected date and doctor
      appointmentService.getAppointmentsByDate(doctor.id, formattedDate)
        .then(response => {
          // Filter out booked time slots
          const bookedSlots = response.data.map(app => 
            format(new Date(app.startTime), 'hh:mm a')
          );
          
          const available = timeSlots.filter(slot => !bookedSlots.includes(slot));
          setAvailableSlots(available);
        })
        .catch(error => {
          console.error("Error fetching appointments:", error);
          // If there's an error, show all slots (fallback)
          setAvailableSlots(timeSlots);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [selectedDate, doctor]);

  const parseTimeToDateTime = (timeStr, dateObj) => {
    // Parse time like "09:00 AM" to get hours and minutes
    const timeObj = parse(timeStr, 'hh:mm a', new Date());
    
    // Set those hours and minutes on the selected date
    return setMinutes(
      setHours(dateObj, timeObj.getHours()),
      timeObj.getMinutes()
    );
  };

  // const calculateEndTime = (startDateTime) => {
  //   // Default appointment duration: 1 hour
  //   return new Date(startDateTime.getTime() + 60 * 60 * 1000);
  // };

  const handleBooking = () => {
    if (!selectedDate || !selectedTime || !symptoms) {
      toast.error('Please complete all fields before confirming.');
      return;
    }

    setLoading(true);

    try {
      // Calculate start and end times
      const startDateTime = parseTimeToDateTime(selectedTime, selectedDate);
      // const endDateTime = calculateEndTime(startDateTime);
      console.log("Start DateTime:", startDateTime);
      // Create appointment request object
      const appointmentData = new AppointmentRequest({
        doctorId: doctor.id,
        patientId: currentUser.id,
        patientName: currentUser.name,
        patientEmail: currentUser.email,
        patientPhone: currentUser.phone,
        patientAge: currentUser.age,
        patientGender: currentUser.gender,
        patientAddress: currentUser.address,
        serviceId: 1, // Replace with actual service ID based on your service model
        startTime: startDateTime.toISOString(),
        consultationFee: doctor.fee,
        reason: symptoms,
        notes: notes,
        duration: 60, // 60 minutes
        medicalHistory: medicalHistory,
        newPatient: isNewPatient
      });

      // Send appointment to backend
      appointmentService.createAppointment(appointmentData)
        .then(response => {
          toast.success('Appointment booked successfully!');
          console.log("Appointment booked:", response.data);
        })
        .catch(error => {
          console.error("Error booking appointment:", error);
          toast.error('Failed to book appointment. Please try again.');
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  if (!doctor) return <div className="text-center text-red-500 text-lg mt-10">🚫 Doctor not found</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-8 px-6 py-10 max-w-6xl mx-auto">
      {/* Stepper & Form Section */}
      <div className="w-full lg:w-1/2 space-y-8 bg-white p-6 rounded-2xl shadow">
        {/* Step Indicator */}
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

        {/* Step 1: Calendar */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-2 text-purple-700">📅 Select a Date</h2>
            <Calendar
              onChange={(date) => setSelectedDate(date)}
              minDate={new Date()}
              value={selectedDate}
              className="rounded-md shadow-md"
            />
            <p className="text-gray-500 text-sm mt-3">Choose your preferred appointment date.</p>
          </div>
        )}

        {/* Step 2: Time */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-2 text-purple-700">⏰ Select Time Slot</h2>
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
              </div>
            ) : (
              <>
                {availableSlots.length === 0 ? (
                  <p className="text-red-500 text-center py-4">No time slots available for this date.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedTime(slot)}
                        className={`py-2 px-3 text-sm rounded-lg border font-medium transition ${
                          selectedTime === slot
                            ? 'bg-purple-100 border-purple-500 text-purple-700'
                            : 'hover:bg-purple-50 border-gray-300'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Step 3: Appointment Details */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-2 text-purple-700">📝 Appointment Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms</label>
                <textarea
                  rows={3}
                  className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="Describe your symptoms in detail..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
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

              <div className="bg-gray-100 p-4 mt-4 rounded-md text-sm">
                <p><strong>Date:</strong> {selectedDate ? format(selectedDate, 'PPP') : 'Not selected'}</p>
                <p><strong>Time:</strong> {selectedTime || 'Not selected'}</p>
                <p><strong>Doctor:</strong> {doctor.name}</p>
                <p><strong>Patient:</strong> {currentUser.name}</p>
                <p><strong>Consultation Fee:</strong> ${doctor.fee}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          {step > 1 && (
            <button
              onClick={() => setStep((prev) => prev - 1)}
              className="text-sm text-gray-600 hover:underline"
              disabled={loading}
            >
              ← Back
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={() => setStep((prev) => prev + 1)}
              disabled={(step === 1 && !selectedDate) || (step === 2 && !selectedTime) || loading}
              className={`px-5 py-2 text-white rounded-lg transition ${
                (step === 1 && !selectedDate) || (step === 2 && !selectedTime) || loading
                  ? 'bg-purple-300 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleBooking}
              disabled={loading}
              className={`px-5 py-2 text-white rounded-lg transition ${
                loading 
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
          )}
        </div>
      </div>

      {/* Doctor Info Section */}
      <div className="w-full lg:w-1/2 bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-2xl font-bold text-indigo-700 mb-6">👨‍⚕️ Doctor Details</h3>
        <div className="flex gap-6 items-center">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-indigo-600"
          />
          <div>
            <p className="text-lg font-semibold text-gray-800">{doctor.name}</p>
            <p className="text-sm text-indigo-500">{doctor.specialization}</p>
            <p className="text-sm text-gray-600 mt-1">🗓 {doctor.experience} years experience</p>
            <p className="text-sm text-gray-600">💰 ${doctor.fee} consultation fee</p>
            <p className="text-sm text-gray-500 mt-2">{doctor.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}