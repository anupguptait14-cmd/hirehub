const Company = require('../models/Company');
const RecruiterProfile = require('../models/RecruiterProfile');
const Job = require('../models/Job');

// @desc    Create company profile
// @route   POST /api/companies
// @access  Private (Recruiter/Admin)
const createCompany = async (req, res, next) => {
  try {
    const { name, description, industry, companySize, website, location, foundedYear } = req.body;

    const existingCompany = await Company.findOne({ name });
    if (existingCompany) {
      return res.status(400).json({ message: 'Company with this name already exists' });
    }

    let logoUrl = 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200';
    let publicId = '';

    if (req.file) {
      logoUrl = `/uploads/${req.file.filename}`;
      publicId = req.file.filename;
    }

    const company = await Company.create({
      name,
      description,
      industry,
      companySize,
      website,
      location,
      foundedYear,
      createdBy: req.user._id,
      logo: { url: logoUrl, public_id: publicId },
    });

    // Link recruiter profile to company
    if (req.user.role === 'recruiter') {
      await RecruiterProfile.findOneAndUpdate(
        { user: req.user._id },
        { company: company._id },
        { upsert: true }
      );
    }

    res.status(201).json(company);
  } catch (error) {
    next(error);
  }
};

// @desc    Get companies list (public)
// @route   GET /api/companies
// @access  Public
const getCompanies = async (req, res, next) => {
  try {
    const { keyword, industry, page = 1, limit = 12 } = req.query;
    const query = { status: 'active' };

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { location: { $regex: keyword, $options: 'i' } },
      ];
    }

    if (industry) {
      query.industry = industry;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Company.countDocuments(query);
    const companies = await Company.find(query)
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum);

    res.json({
      companies,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single company details & posted jobs
// @route   GET /api/companies/:id
// @access  Public
const getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const jobs = await Job.find({ company: company._id, status: 'active' }).sort('-createdAt');

    res.json({
      company,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update company
// @route   PUT /api/companies/:id
// @access  Private (Recruiter/Admin)
const updateCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Authorization check
    if (company.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this company' });
    }

    const { name, description, industry, companySize, website, location, foundedYear } = req.body;

    if (name) company.name = name;
    if (description) company.description = description;
    if (industry) company.industry = industry;
    if (companySize) company.companySize = companySize;
    if (website) company.website = website;
    if (location) company.location = location;
    if (foundedYear) company.foundedYear = foundedYear;

    if (req.file) {
      company.logo = {
        url: `/uploads/${req.file.filename}`,
        public_id: req.file.filename,
      };
    }

    await company.save();

    res.json(company);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
};
