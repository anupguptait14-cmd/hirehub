const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  getAdminJobs,
  updateAdminJobStatus,
  getAdminCompanies,
  updateAdminCompanyStatus,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect, authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id', updateUserStatus);
router.get('/jobs', getAdminJobs);
router.put('/jobs/:id/status', updateAdminJobStatus);
router.get('/companies', getAdminCompanies);
router.put('/companies/:id/status', updateAdminCompanyStatus);

module.exports = router;
