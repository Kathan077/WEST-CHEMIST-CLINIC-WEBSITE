const express = require('express');
const router = express.Router();
const {
  getSchedulesAndHolidays,
  bulkSaveSchedules,
  bulkSaveHolidays,
  removeHolidays,
  clearSchedules,
  toggleClinicStatus,
  importSchedules
} = require('../controllers/scheduleController');

// Retrieve all scheduling settings
router.get('/', getSchedulesAndHolidays);

// Update/Save slots and timings
router.post('/bulk-save', bulkSaveSchedules);

// Toggle open/closed status for dates
router.post('/clinic-toggle', toggleClinicStatus);

// Bulk insert holidays
router.post('/holiday-bulk', bulkSaveHolidays);

// Delete/Remove holidays
router.post('/holiday-remove', removeHolidays);

// Clear custom overridden dates
router.post('/clear', clearSchedules);

// Database import backup dump
router.post('/import', importSchedules);

module.exports = router;
