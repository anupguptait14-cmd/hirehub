const User = require('../models/User');
const Job = require('../models/Job');
const Company = require('../models/Company');
const Application = require('../models/Application');

// @desc    Get admin platform analytics dashboard metrics
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCandidates = await User.countDocuments({ role: 'candidate' });
    const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'active' });
    const totalCompanies = await Company.countDocuments();
    const totalApplications = await Application.countDocuments();

    // Recent activity metrics
    const recentUsers = await User.find().sort('-createdAt').limit(5).select('-password');
    const recentJobs = await Job.find().populate('company', 'name logo').sort('-createdAt').limit(5);

    res.json({
      metrics: {
        totalUsers,
        totalCandidates,
        totalRecruiters,
        totalJobs,
        activeJobs,
        totalCompanies,
        totalApplications,
      },
      recentUsers,
      recentJobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private (Admin)
const getUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum);

    res.json({
      users,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role or status (active/suspended)
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
const updateUserStatus = async (req, res, next) => {
  try {
    const { role, status } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (role) user.role = role;
    if (status) user.status = status;

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs moderation list
// @route   GET /api/admin/jobs
// @access  Private (Admin)
const getAdminJobs = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('company', 'name logo')
      .populate('postedBy', 'name email')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum);

    res.json({
      jobs,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job status (active, paused, closed, pending)
// @route   PUT /api/admin/jobs/:id/status
// @access  Private (Admin)
const updateAdminJobStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job listing not found' });
    }

    job.status = status;
    await job.save();

    res.json(job);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all companies moderation list
// @route   GET /api/admin/companies
// @access  Private (Admin)
const getAdminCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find()
      .populate('createdBy', 'name email')
      .sort('-createdAt');

    res.json(companies);
  } catch (error) {
    next(error);
  }
};

// @desc    Update company status (active, suspended, pending)
// @route   PUT /api/admin/companies/:id/status
// @access  Private (Admin)
const updateAdminCompanyStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    company.status = status;
    await company.save();

    res.json(company);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  getAdminJobs,
  updateAdminJobStatus,
  getAdminCompanies,
  updateAdminCompanyStatus,
};
