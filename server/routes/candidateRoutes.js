const express = require('express');
const router = express.Router();
const {
  getCandidateProfile,
  updateCandidateProfile,
  uploadResume,
} = require('../controllers/candidateController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/profile', protect, authorize('candidate'), getCandidateProfile);
router.put('/profile', protect, authorize('candidate'), updateCandidateProfile);
router.post('/resume', protect, authorize('candidate'), upload.single('resume'), uploadResume);

module.exports = router;
