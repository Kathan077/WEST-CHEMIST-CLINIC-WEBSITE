const ClinicSchedule = require('../models/ClinicSchedule');
const ClinicHoliday = require('../models/ClinicHoliday');
const { invalidateAffectedAppointments } = require('../services/slotService');

// Helper to standardise slot lists if generated from duration
const generateSlotsFromConfig = (start, end, duration, buffer, lunchStart, lunchEnd, breakStart, breakEnd) => {
  // Simple helper to parse "HH:MM AM/PM" to minutes from midnight
  const parseTimeToMin = (timeStr) => {
    if (!timeStr) return null;
    const match = timeStr.match(/^(\d{2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return null;
    let h = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    const ampm = match[3].toUpperCase();
    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  };

  const formatMinToTime = (totalMin) => {
    let h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    if (h > 12) h -= 12;
    if (h === 0) h = 12;
    const padH = String(h).padStart(2, '0');
    const padM = String(m).padStart(2, '0');
    return `${padH}:${padM} ${ampm}`;
  };

  const startMin = parseTimeToMin(start || "09:00 AM");
  const endMin = parseTimeToMin(end || "06:00 PM");
  const lunchS = parseTimeToMin(lunchStart);
  const lunchE = parseTimeToMin(lunchEnd);
  const breakS = parseTimeToMin(breakStart);
  const breakE = parseTimeToMin(breakEnd);

  const slots = [];
  let current = startMin;
  const slotLength = duration || 15;
  const gap = buffer || 0;

  while (current + slotLength <= endMin) {
    // Check if slot falls during lunch
    const inLunch = lunchS !== null && lunchE !== null && (current >= lunchS && current < lunchE);
    // Check if slot falls during short break
    const inBreak = breakS !== null && breakE !== null && (current >= breakS && current < breakE);

    if (!inLunch && !inBreak) {
      slots.push(formatMinToTime(current));
    }
    current += slotLength + gap;
  }
  return slots;
};

// @desc    Get all schedules & holidays
// @route   GET /api/schedule
// @access  Private/Admin
const getSchedulesAndHolidays = async (req, res) => {
  try {
    const branch = req.query.branch || 'default';
    const schedules = await ClinicSchedule.find({ branch });
    const holidays = await ClinicHoliday.find({ branch });
    
    // Seed default schedule if empty
    if (schedules.length === 0) {
      const defaultSch = await ClinicSchedule.create({
        scheduleType: 'default',
        slots: [
          "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
          "11:00 AM", "11:30 AM", "01:00 PM", "01:30 PM",
          "02:00 PM", "02:30 PM", "03:00 PM", "04:00 PM",
          "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM"
        ],
        duration: 30,
        buffer: 0,
        maxAppointments: 1,
        isClosed: false,
        branch
      });
      schedules.push(defaultSch);
    }

    res.status(200).json({
      success: true,
      schedules,
      holidays
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving schedules', error: error.message });
  }
};

// @desc    Bulk save schedules for dates / weekly / monthly recurring
// @route   POST /api/schedule/bulk-save
// @access  Private/Admin
const bulkSaveSchedules = async (req, res) => {
  try {
    const {
      dates,        // array of strings "YYYY-MM-DD"
      weeklyDays,   // array of numbers (0-6)
      monthlyDays,  // array of numbers (1-31)
      yearlyDates,  // array of objects { month, day }
      slots,        // pre-formed array of slot strings
      duration,
      buffer,
      maxAppointments,
      lunchStart,
      lunchEnd,
      breakStart,
      breakEnd,
      isClosed,
      applyToAll,   // boolean, true to override the default slots template
      branch
    } = req.body;

    const targetBranch = branch || 'default';

    const slotList = slots && slots.length > 0 
      ? slots 
      : generateSlotsFromConfig("09:00 AM", "06:00 PM", duration, buffer, lunchStart, lunchEnd, breakStart, breakEnd);

    const config = {
      slots: slotList,
      duration: duration || 15,
      buffer: buffer || 0,
      maxAppointments: maxAppointments || 1,
      lunchStart,
      lunchEnd,
      breakStart,
      breakEnd,
      isClosed: !!isClosed,
      branch: targetBranch
    };

    // 1. Default templates updates
    if (applyToAll) {
      await ClinicSchedule.findOneAndUpdate(
        { scheduleType: 'default', branch: targetBranch },
        { ...config },
        { upsert: true, new: true }
      );
    }

    // 2. Specific dates overrides
    if (dates && Array.isArray(dates)) {
      for (const d of dates) {
        if (!d) continue;
        await ClinicSchedule.findOneAndUpdate(
          { scheduleType: 'specific-date', dateStr: d, branch: targetBranch },
          { ...config, dateStr: d },
          { upsert: true }
        );
      }
    }

    // 3. Weekly recurring
    if (weeklyDays && Array.isArray(weeklyDays)) {
      for (const wd of weeklyDays) {
        await ClinicSchedule.findOneAndUpdate(
          { scheduleType: 'weekly', dayOfWeek: wd, branch: targetBranch },
          { ...config, dayOfWeek: wd },
          { upsert: true }
        );
      }
    }

    // 4. Monthly recurring
    if (monthlyDays && Array.isArray(monthlyDays)) {
      for (const md of monthlyDays) {
        await ClinicSchedule.findOneAndUpdate(
          { scheduleType: 'monthly', dayOfMonth: md, branch: targetBranch },
          { ...config, dayOfMonth: md },
          { upsert: true }
        );
      }
    }

    // 5. Yearly recurring
    if (yearlyDates && Array.isArray(yearlyDates)) {
      for (const yd of yearlyDates) {
        await ClinicSchedule.findOneAndUpdate(
          { scheduleType: 'yearly', month: yd.month, day: yd.day, branch: targetBranch },
          { ...config, month: yd.month, day: yd.day },
          { upsert: true }
        );
      }
    }

    res.status(200).json({ success: true, message: 'Schedules successfully overridden' });
    invalidateAffectedAppointments(targetBranch).catch(err => console.error(`Audit error: ${err.message}`));
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error bulk saving schedules', error: error.message });
  }
};

// @desc    Bulk save holidays (create single/multiple or range)
// @route   POST /api/schedule/holiday-bulk
// @access  Private/Admin
const bulkSaveHolidays = async (req, res) => {
  try {
    const { holidays, branch } = req.body; // array of holiday objects
    const targetBranch = branch || 'default';
    if (!holidays || !Array.isArray(holidays)) {
      return res.status(400).json({ success: false, message: 'Invalid holidays payload' });
    }

    const inserted = [];
    for (const h of holidays) {
      if (!h.holidayType || !h.startDateStr) continue;
      
      const record = await ClinicHoliday.create({
        holidayType: h.holidayType,
        startDateStr: h.startDateStr,
        endDateStr: h.endDateStr || null,
        month: h.month !== undefined ? h.month : null,
        day: h.day !== undefined ? h.day : null,
        name: h.name || 'Clinic Holiday',
        branch: targetBranch
      });
      inserted.push(record);
    }

    res.status(200).json({ success: true, message: 'Holidays successfully added', data: inserted });
    invalidateAffectedAppointments(targetBranch).catch(err => console.error(`Audit error: ${err.message}`));
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error bulk saving holidays', error: error.message });
  }
};

// @desc    Delete/Remove selected holidays
// @route   POST /api/schedule/holiday-remove
// @access  Private/Admin
const removeHolidays = async (req, res) => {
  try {
    const { ids, dates, branch } = req.body;
    const targetBranch = branch || 'default';
    if (ids && Array.isArray(ids)) {
      await ClinicHoliday.deleteMany({ _id: { $in: ids } });
    }
    if (dates && Array.isArray(dates)) {
      await ClinicHoliday.deleteMany({ startDateStr: { $in: dates }, branch: targetBranch });
    }
    res.status(200).json({ success: true, message: 'Selected holidays removed successfully' });
    invalidateAffectedAppointments(targetBranch).catch(err => console.error(`Audit error: ${err.message}`));
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error removing holidays', error: error.message });
  }
};

// @desc    Clear schedules (remove all date-specific overrides)
// @route   POST /api/schedule/clear
// @access  Private/Admin
const clearSchedules = async (req, res) => {
  try {
    const { dates, weeklyDays, monthlyDays, yearlyDates, clearAllOverrides, branch } = req.body;
    const targetBranch = branch || 'default';
    
    if (clearAllOverrides) {
      await ClinicSchedule.deleteMany({ scheduleType: { $ne: 'default' }, branch: targetBranch });
      await ClinicHoliday.deleteMany({ branch: targetBranch });
    } else {
      if (dates && Array.isArray(dates)) {
        await ClinicSchedule.deleteMany({ scheduleType: 'specific-date', dateStr: { $in: dates }, branch: targetBranch });
      }
      if (weeklyDays && Array.isArray(weeklyDays)) {
        await ClinicSchedule.deleteMany({ scheduleType: 'weekly', dayOfWeek: { $in: weeklyDays }, branch: targetBranch });
      }
      if (monthlyDays && Array.isArray(monthlyDays)) {
        await ClinicSchedule.deleteMany({ scheduleType: 'monthly', dayOfMonth: { $in: monthlyDays }, branch: targetBranch });
      }
      if (yearlyDates && Array.isArray(yearlyDates)) {
        for (const yd of yearlyDates) {
          await ClinicSchedule.deleteMany({ scheduleType: 'yearly', month: yd.month, day: yd.day, branch: targetBranch });
        }
      }
    }

    res.status(200).json({ success: true, message: 'Selected schedules cleared successfully' });
    invalidateAffectedAppointments(targetBranch).catch(err => console.error(`Audit error: ${err.message}`));
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error clearing schedules', error: error.message });
  }
};

// @desc    Bulk toggle Open / Close clinic for dates
// @route   POST /api/schedule/clinic-toggle
// @access  Private/Admin
const toggleClinicStatus = async (req, res) => {
  try {
    const { dates, isClosed, branch } = req.body;
    const targetBranch = branch || 'default';
    if (!dates || !Array.isArray(dates)) {
      return res.status(400).json({ success: false, message: 'Dates array required' });
    }

    // Default template slots to replicate if creating a new date schedule
    const defaultSch = await ClinicSchedule.findOne({ scheduleType: 'default', branch: targetBranch });
    const defaultSlots = defaultSch ? defaultSch.slots : [];

    for (const d of dates) {
      await ClinicSchedule.findOneAndUpdate(
        { scheduleType: 'specific-date', dateStr: d, branch: targetBranch },
        { 
          isClosed: !!isClosed,
          dateStr: d,
          slots: defaultSlots,
          branch: targetBranch
        },
        { upsert: true }
      );
    }

    res.status(200).json({ success: true, message: `Clinic status set to ${isClosed ? 'Closed' : 'Open'} for selected dates` });
    invalidateAffectedAppointments(targetBranch).catch(err => console.error(`Audit error: ${err.message}`));
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error toggling clinic open/closed status', error: error.message });
  }
};

// @desc    Import JSON schedule backup dump
// @route   POST /api/schedule/import
// @access  Private/Admin
const importSchedules = async (req, res) => {
  try {
    const { schedules, holidays, branch } = req.body;
    const targetBranch = branch || 'default';
    
    if (schedules && Array.isArray(schedules)) {
      await ClinicSchedule.deleteMany({ branch: targetBranch });
      const schedulesWithBranch = schedules.map(s => {
        const { _id, ...rest } = s;
        return { ...rest, branch: targetBranch };
      });
      await ClinicSchedule.insertMany(schedulesWithBranch);
    }
    if (holidays && Array.isArray(holidays)) {
      await ClinicHoliday.deleteMany({ branch: targetBranch });
      const holidaysWithBranch = holidays.map(h => {
        const { _id, ...rest } = h;
        return { ...rest, branch: targetBranch };
      });
      await ClinicHoliday.insertMany(holidaysWithBranch);
    }
    
    res.status(200).json({ success: true, message: 'Schedules and holidays database backup successfully imported' });
    invalidateAffectedAppointments(targetBranch).catch(err => console.error(`Audit error: ${err.message}`));
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to import backup payload', error: error.message });
  }
};

module.exports = {
  getSchedulesAndHolidays,
  bulkSaveSchedules,
  bulkSaveHolidays,
  removeHolidays,
  clearSchedules,
  toggleClinicStatus,
  importSchedules
};
