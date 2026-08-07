const express = require('express');
const router = express.Router();
const {
  getRecruiterProfile,
  updateRecruiterProfile,
} = require('../controllers/recruiterController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/profile', protect, authorize('recruiter'), getRecruiterProfile);
router.put('/profile', protect, authorize('recruiter'), updateRecruiterProfile);

module.exports = router;
