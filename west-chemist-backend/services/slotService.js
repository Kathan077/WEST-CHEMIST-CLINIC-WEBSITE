const Appointment = require('../models/Appointment');

// Default operational time slots matching the frontend TIMES
const DEFAULT_SLOTS = [
  "09:00 AM", 
  "09:30 AM", 
  "10:00 AM", 
  "10:30 AM", 
  "11:00 AM", 
  "11:30 AM", 
  "01:00 PM", 
  "01:30 PM", 
  "02:00 PM", 
  "02:30 PM", 
  "03:00 PM", 
  "04:00 PM"
];

/**
 * Get available slots for a specific clinic and date
 * @param {string} clinic - Clinic location
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Array<{time: string, available: boolean}>>}
 */
const getAvailableSlots = async (clinic, date) => {
  if (!clinic || !date) {
    throw new Error('Clinic and date are required to fetch slots');
  }

  // Find all active (non-cancelled) appointments for this clinic and date
  const bookedAppointments = await Appointment.find({
    clinic,
    date,
    status: { $ne: 'cancelled' }
  }).select('time');

  // Extract booked times
  const bookedTimes = bookedAppointments.map(appt => appt.time);

  // Map default slots and mark availability
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const reqDateStr = date.split('T')[0];

  const slotsWithAvailability = DEFAULT_SLOTS.map(time => {
    let available = !bookedTimes.includes(time);

    // If the date is today, check if the slot is in the past
    if (available && reqDateStr === todayStr) {
      const match = time.match(/^(\d{2}):(\d{2})\s*(AM|PM)$/i);
      if (match) {
        let hours = parseInt(match[1]);
        const minutes = parseInt(match[2]);
        const ampm = match[3].toUpperCase();

        if (ampm === 'PM' && hours < 12) {
          hours += 12;
        } else if (ampm === 'AM' && hours === 12) {
          hours = 0;
        }

        const slotDateTime = new Date();
        slotDateTime.setHours(hours, minutes, 0, 0);

        if (today.getTime() > slotDateTime.getTime()) {
          available = false;
        }
      }
    }

    return {
      time,
      available
    };
  });

  return slotsWithAvailability;
};

module.exports = {
  getAvailableSlots,
  DEFAULT_SLOTS
};
