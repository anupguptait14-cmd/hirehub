const Job = require('../models/Job');
const Company = require('../models/Company');
const RecruiterProfile = require('../models/RecruiterProfile');

// @desc    Get all jobs (public search, filter, sort, paginate)
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res, next) => {
  try {
    const {
      keyword,
      location,
      workMode,
      jobType,
      experienceLevel,
      minSalary,
      maxSalary,
      skills,
      sort = '-createdAt',
      page = 1,
      limit = 9,
    } = req.query;

    const query = { status: 'active' };

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { skills: { $regex: keyword, $options: 'i' } },
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (workMode) {
      query.workMode = workMode;
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    if (minSalary) {
      query.salaryMax = { $gte: Number(minSalary) };
    }

    if (maxSalary) {
      query.salaryMin = { $lte: Number(maxSalary) };
    }

    if (skills) {
      const skillsArray = skills.split(',').map((s) => s.trim());
      query.skills = { $in: skillsArray.map((s) => new RegExp(s, 'i')) };
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('company', 'name logo location industry companySize')
      .sort(sort)
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

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company')
      .populate('postedBy', 'name email avatar');

    if (!job) {
      return res.status(404).json({ message: 'Job listing not found' });
    }

    res.json(job);
  } catch (error) {
    next(error);
  }
};

// @desc    Create job listing
// @route   POST /api/jobs
// @access  Private (Recruiter / Admin)
const createJob = async (req, res, next) => {
  try {
    let companyId = req.body.companyId;

    if (!companyId && req.user.role === 'recruiter') {
      const recruiterProf = await RecruiterProfile.findOne({ user: req.user._id });
      if (recruiterProf && recruiterProf.company) {
        companyId = recruiterProf.company;
      }
    }

    if (!companyId) {
      return res.status(400).json({ message: 'Please create or select a company profile before posting a job' });
    }

    const companyExists = await Company.findById(companyId);
    if (!companyExists) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const {
      title,
      description,
      responsibilities,
      requirements,
      skills,
      location,
      workMode,
      jobType,
      experienceLevel,
      salaryMin,
      salaryMax,
      salaryCurrency,
      deadline,
    } = req.body;

    const job = await Job.create({
      title,
      company: companyId,
      postedBy: req.user._id,
      description,
      responsibilities: Array.isArray(responsibilities)
        ? responsibilities
        : (responsibilities || '').split('\n').filter(Boolean),
      requirements: Array.isArray(requirements)
        ? requirements
        : (requirements || '').split('\n').filter(Boolean),
      skills: Array.isArray(skills)
        ? skills
        : (skills || '').split(',').map((s) => s.trim()).filter(Boolean),
      location,
      workMode,
      jobType,
      experienceLevel,
      salaryMin: salaryMin ? Number(salaryMin) : 0,
      salaryMax: salaryMax ? Number(salaryMax) : 0,
      salaryCurrency: salaryCurrency || 'INR',
      deadline: deadline || null,
    });

    const populatedJob = await Job.findById(job._id).populate('company');

    res.status(201).json(populatedJob);
  } catch (error) {
    next(error);
  }
};

// @desc    Update job listing
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter / Admin)
const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this job listing' });
    }

    const fields = [
      'title',
      'description',
      'location',
      'workMode',
      'jobType',
      'experienceLevel',
      'salaryMin',
      'salaryMax',
      'salaryCurrency',
      'status',
      'deadline',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        job[field] = req.body[field];
      }
    });

    if (req.body.skills !== undefined) {
      job.skills = Array.isArray(req.body.skills)
        ? req.body.skills
        : req.body.skills.split(',').map((s) => s.trim()).filter(Boolean);
    }

    if (req.body.requirements !== undefined) {
      job.requirements = Array.isArray(req.body.requirements)
        ? req.body.requirements
        : req.body.requirements.split('\n').filter(Boolean);
    }

    if (req.body.responsibilities !== undefined) {
      job.responsibilities = Array.isArray(req.body.responsibilities)
        ? req.body.responsibilities
        : req.body.responsibilities.split('\n').filter(Boolean);
    }

    await job.save();
    const updated = await Job.findById(job._id).populate('company');

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job listing
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter / Admin)
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this job listing' });
    }

    await Job.deleteOne({ _id: job._id });

    res.json({ message: 'Job listing removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get jobs posted by current recruiter
// @route   GET /api/jobs/my-jobs
// @access  Private (Recruiter)
const getRecruiterJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id })
      .populate('company', 'name logo')
      .sort('-createdAt');

    res.json(jobs);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getRecruiterJobs,
};
