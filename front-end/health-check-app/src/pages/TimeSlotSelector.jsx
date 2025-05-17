import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { format } from 'date-fns';

// Import apiClient or use the API_BASE_URL
const API_BASE_URL = 'http://localhost:6002';

function TimeSlotSelector({ doctorId, onTimeSelect, onDateSelect }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);

  // Fetch available slots when the date changes
  useEffect(() => {
    if (selectedDate && doctorId) {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      setLoading(true);
      
      // Call the backend API to get available slots
      axios.get(`${API_BASE_URL}/api/appointments/available-slots?doctorId=${doctorId}&date=${formattedDate}`)
        .then(response => {
          console.log("Available slots from API:", response.data);
          setAvailableSlots(response.data);
        })
        .catch(error => {
          console.error("Error fetching available slots:", error);
          setAvailableSlots([]);
        })
        .finally(() => setLoading(false));
        
      // If the parent component needs to know about date changes
      if (onDateSelect) {
        onDateSelect(selectedDate);
      }
    }
  }, [selectedDate, doctorId, onDateSelect]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset selected time when date changes
  };

  const handleTimeSelect = (timeSlot) => {
    setSelectedTime(timeSlot);
    if (onTimeSelect) {
      onTimeSelect(timeSlot);
    }
  };

  // Function to check if the date is a Sunday (disabled)
  const isSunday = ({ date }) => date.getDay() === 0;
  
  return (
    <div className="time-slot-selector">
      <h2 className="text-xl font-semibold mb-3 text-purple-700">📅 Select a Date</h2>
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        minDate={new Date()}
        className="rounded-md shadow-md mb-4" 
        tileDisabled={isSunday} // Disable Sundays
      />
      
      <div className="mt-4">
        <h3 className="text-lg font-medium text-purple-700 mb-2">
          Available slots for {format(selectedDate, 'MMMM d, yyyy')}
        </h3>
        
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 mt-2">
            {availableSlots && availableSlots.length > 0 ? (
              availableSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => handleTimeSelect(slot)}
                  className={`py-2 px-4 rounded-lg transition-colors ${
                    selectedTime === slot
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-100 hover:bg-purple-200 text-purple-800'
                  }`}
                >
                  {slot}
                </button>
              ))
            ) : (
              <p className="col-span-2 text-center text-red-500 py-4">
                No available slots for this date. Please select another date.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TimeSlotSelector;