const express = require('express');
const router = express.Router();
const {
  getSavedJobs,
  saveJob,
  unsaveJob,
} = require('../controllers/savedJobController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', protect, authorize('candidate'), getSavedJobs);
router.post('/:jobId', protect, authorize('candidate'), saveJob);
router.delete('/:jobId', protect, authorize('candidate'), unsaveJob);

module.exports = router;
