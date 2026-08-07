const express = require('express');
const router = express.Router();
const {
  applyToJob,
  getCandidateApplications,
  getJobApplications,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post(
  '/',
  protect,
  authorize('candidate'),
  upload.single('resume'),
  applyToJob
);

router.get(
  '/my-applications',
  protect,
  authorize('candidate'),
  getCandidateApplications
);

router.get(
  '/job/:jobId',
  protect,
  authorize('recruiter', 'admin'),
  getJobApplications
);

router.put(
  '/:id/status',
  protect,
  authorize('recruiter', 'admin'),
  updateApplicationStatus
);

module.exports = router;
