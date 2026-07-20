const Appointment = require('../models/Appointment');
const ClinicSchedule = require('../models/ClinicSchedule');
const ClinicHoliday = require('../models/ClinicHoliday');

// All default slots (16 slots up to 06:00 PM)
const DEFAULT_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "01:00 PM", "01:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "04:00 PM",
  "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM"
];

/**
 * Get available slots for a specific clinic and date
 * @param {string} clinic - Clinic location
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Array<{time: string, available: boolean, isHoliday?: boolean, isClosed?: boolean}>>}
 */
const getAvailableSlots = async (clinic, date, excludeAppointmentId = null) => {
  if (!clinic || !date) {
    throw new Error('Clinic and date are required to fetch slots');
  }

  const reqDateStr = date.split('T')[0]; // "YYYY-MM-DD"
  const parts = reqDateStr.split('-');
  if (parts.length !== 3) {
    throw new Error('Invalid date format. Expected YYYY-MM-DD');
  }

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // 0-indexed: 0 = Jan
  const day = parseInt(parts[2], 10);
  
  // Calculate day of the week in UTC to avoid server timezone offset shifts
  const utcDate = new Date(Date.UTC(year, month, day));
  const dayOfWeek = utcDate.getUTCDay(); // 0 = Sunday, 6 = Saturday

  // 1. Check if the date is blocked by any Holiday configuration
  const allHolidays = await ClinicHoliday.find({ branch: clinic });
  let matchesHoliday = false;
  let holidayName = 'Clinic Holiday';

  for (const h of allHolidays) {
    if (h.holidayType === 'specific-date' && h.startDateStr === reqDateStr) {
      matchesHoliday = true;
      holidayName = h.name;
      break;
    }
    if (h.holidayType === 'date-range') {
      const end = h.endDateStr || h.startDateStr;
      if (reqDateStr >= h.startDateStr && reqDateStr <= end) {
        matchesHoliday = true;
        holidayName = h.name;
        break;
      }
    }
    if (h.holidayType === 'recurring-yearly' && h.month === month && h.day === day) {
      matchesHoliday = true;
      holidayName = h.name;
      break;
    }
    if (h.holidayType === 'recurring-monthly' && h.day === day) {
      matchesHoliday = true;
      holidayName = h.name;
      break;
    }
  }

  // 2. Fetch all scheduling options to evaluate precedence
  const schedules = await ClinicSchedule.find({ branch: clinic });
  
  // Seed a default schedule in db if none exists
  if (schedules.length === 0) {
    const defaultSch = await ClinicSchedule.create({
      scheduleType: 'default',
      slots: DEFAULT_SLOTS,
      duration: 30,
      buffer: 0,
      maxAppointments: 1,
      isClosed: false,
      branch: clinic
    });
    schedules.push(defaultSch);
  }

  // Determine active schedule based on priority:
  // specific-date > yearly > monthly > weekly > default
  let activeSchedule = null;
  
  const specificDateSch = schedules.find(s => s.scheduleType === 'specific-date' && s.dateStr === reqDateStr);
  const yearlySch = schedules.find(s => s.scheduleType === 'yearly' && s.month === month && s.day === day);
  const monthlySch = schedules.find(s => s.scheduleType === 'monthly' && s.dayOfMonth === day);
  const weeklySch = schedules.find(s => s.scheduleType === 'weekly' && s.dayOfWeek === dayOfWeek);
  const defaultSch = schedules.find(s => s.scheduleType === 'default');

  if (specificDateSch) {
    activeSchedule = specificDateSch;
  } else if (yearlySch) {
    activeSchedule = yearlySch;
  } else if (monthlySch) {
    activeSchedule = monthlySch;
  } else if (weeklySch) {
    activeSchedule = weeklySch;
  } else {
    activeSchedule = defaultSch;
  }

  const baseSlots = (activeSchedule && activeSchedule.slots && activeSchedule.slots.length > 0)
    ? activeSchedule.slots
    : DEFAULT_SLOTS;

  // If matches holiday, block all base slots as Holiday
  if (matchesHoliday) {
    return baseSlots.map(time => ({
      time,
      available: false,
      isHoliday: true,
      holidayName
    }));
  }

  // If clinic is marked Closed for this schedule tier, block all slots
  if (activeSchedule && activeSchedule.isClosed) {
    return baseSlots.map(time => ({
      time,
      available: false,
      isClosed: true
    }));
  }

  // 3. Find booked appointments count per slot (optionally excluding a specific appointment ID)
  const bookedQuery = {
    clinic,
    date: reqDateStr,
    status: { $nin: ['cancelled', 'rejected'] }
  };
  if (excludeAppointmentId) {
    bookedQuery._id = { $ne: excludeAppointmentId };
  }
  const bookedAppointments = await Appointment.find(bookedQuery).select('time');

  // Count bookings per slot
  const bookingsMap = {};
  bookedAppointments.forEach(appt => {
    bookingsMap[appt.time] = (bookingsMap[appt.time] || 0) + 1;
  });

  const maxApptsLimit = (activeSchedule && activeSchedule.maxAppointments) 
    ? activeSchedule.maxAppointments 
    : 1;

  // 4. Map and evaluate slot availability
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // For checking past dates
  const reqDate = new Date(year, month, day, 23, 59, 59, 999);
  const isPastDay = reqDate < today && reqDateStr !== todayStr;

  const slotsWithAvailability = baseSlots.map(time => {
    let available = true;

    // Check if slot has reached limit
    const currentBookedCount = bookingsMap[time] || 0;
    if (currentBookedCount >= maxApptsLimit) {
      available = false;
    }

    // Check if date is in the past
    if (isPastDay) {
      available = false;
    }

    // If date is today, check if time has already passed
    if (available && reqDateStr === todayStr) {
      const match = time.match(/^(\d{2}):(\d{2})\s*(AM|PM)$/i);
      if (match) {
        let hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
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

/**
 * Audit all active bookings for a branch and flag ones that are no longer valid under new schedules
 * @param {string} branch - Clinic location branch name
 */
const invalidateAffectedAppointments = async (branch) => {
  try {
    // 1. Find all active appointments for this branch
    const activeAppointments = await Appointment.find({
      clinic: branch,
      status: { $in: ['pending', 'approved', 'rescheduled'] }
    });

    if (activeAppointments.length === 0) return;

    // 2. Group appointments by date
    const appointmentsByDate = {};
    activeAppointments.forEach(appt => {
      if (!appointmentsByDate[appt.date]) {
        appointmentsByDate[appt.date] = [];
      }
      appointmentsByDate[appt.date].push(appt);
    });

    // 3. Evaluate each appointment's slot
    for (const dateStr of Object.keys(appointmentsByDate)) {
      const slots = await getAvailableSlots(branch, dateStr);
      const apptsForDate = appointmentsByDate[dateStr];

      for (const appt of apptsForDate) {
        const matchedSlot = slots.find(s => s.time === appt.time);
        const isClosed = slots.some(s => s.isClosed);
        const isHoliday = slots.some(s => s.isHoliday);
        const slotExists = !!matchedSlot;

        if (isClosed || isHoliday || !slotExists) {
          // Slot is invalidated!
          if (!appt.isRescheduleNeeded) {
            appt.isRescheduleNeeded = true;
            appt.status = 'pending'; // revert to pending for rescheduling action
            appt.adminNote = `System Alert: Appointment slot invalidated due to a clinic schedule/holiday change. Awaiting reschedule.`;
            await appt.save();

            // Fetch patient and send email notification
            const Patient = require('../models/Patient');
            const patient = await Patient.findById(appt.patientId);
            if (patient) {
              const emailService = require('./emailService');
              emailService.sendRescheduleNotice(appt, patient).catch(err => {
                console.error(`⚠️ Failed to send reschedule notice email: ${err.message}`);
              });
            }
          }
        } else {
          // If the slot became valid again (e.g. admin reopened the date), restore the flag
          if (appt.isRescheduleNeeded) {
            appt.isRescheduleNeeded = false;
            appt.adminNote = `System Alert: Clinic slot became available again.`;
            await appt.save();
          }
        }
      }
    }
  } catch (err) {
    console.error(`❌ Error auditing schedule invalidation: ${err.message}`);
  }
};

module.exports = {
  getAvailableSlots,
  DEFAULT_SLOTS,
  invalidateAffectedAppointments
};
