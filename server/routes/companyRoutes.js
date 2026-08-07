const express = require('express');
const router = express.Router();
const {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
} = require('../controllers/companyController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getCompanies);
router.get('/:id', getCompanyById);

router.post(
  '/',
  protect,
  authorize('recruiter', 'admin'),
  upload.single('logo'),
  createCompany
);

router.put(
  '/:id',
  protect,
  authorize('recruiter', 'admin'),
  upload.single('logo'),
  updateCompany
);

module.exports = router;
