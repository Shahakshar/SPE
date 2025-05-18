import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import appointmentService from '../services/apiService';
import 'react-calendar/dist/Calendar.css';

function TimeSlotSelector({ doctorId, onDateSelect, onTimeSelect }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    if (selectedDate && doctorId) {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      setLoading(true);
      
      appointmentService.getAvailableSlots(doctorId, formattedDate)
        .then(response => {
          console.log("Available slots from API:", response.data);
          setAvailableSlots(response.data);
        })
        .catch(error => {
          console.error("Error fetching available slots:", error);
          setAvailableSlots([]);
        })
        .finally(() => setLoading(false));
    }
  }, [selectedDate, doctorId]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  const handleTimeSelection = (time) => {
    setSelectedTime(time);
    if (onTimeSelect) {
      onTimeSelect(time);
    }
  };

  return (
    <div className="space-y-6">
      <div className="calendar-container">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          minDate={new Date()}
          className="mx-auto"
          tileDisabled={({ date }) => date.getDay() === 0} // Disable Sundays
        />
      </div>

      {selectedDate && (
        <div className="time-slots mt-4">
          <h3 className="text-lg font-medium mb-3">Available Time Slots</h3>
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
            </div>
          ) : availableSlots.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => handleTimeSelection(slot)}
                  className={`p-2 text-sm rounded-lg transition ${
                    selectedTime === slot
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 hover:bg-purple-100'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No available slots for this date</p>
          )}
        </div>
      )}
    </div>
  );
}

export default TimeSlotSelector;