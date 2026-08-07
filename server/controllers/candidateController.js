const CandidateProfile = require('../models/CandidateProfile');

// @desc    Get current candidate profile
// @route   GET /api/candidates/profile
// @access  Private (Candidate)
const getCandidateProfile = async (req, res, next) => {
  try {
    let profile = await CandidateProfile.findOne({ user: req.user._id }).populate('user', 'name email avatar');

    if (!profile) {
      profile = await CandidateProfile.create({ user: req.user._id });
      profile = await profile.populate('user', 'name email avatar');
    }

    res.json(profile);
  } catch (error) {
    next(error);
  }
};

// @desc    Update candidate profile
// @route   PUT /api/candidates/profile
// @access  Private (Candidate)
const updateCandidateProfile = async (req, res, next) => {
  try {
    const { headline, bio, location, phone, website, github, linkedin, skills, experience, education } = req.body;

    let profile = await CandidateProfile.findOne({ user: req.user._id });

    if (!profile) {
      profile = new CandidateProfile({ user: req.user._id });
    }

    if (headline !== undefined) profile.headline = headline;
    if (bio !== undefined) profile.bio = bio;
    if (location !== undefined) profile.location = location;
    if (phone !== undefined) profile.phone = phone;
    if (website !== undefined) profile.website = website;
    if (github !== undefined) profile.github = github;
    if (linkedin !== undefined) profile.linkedin = linkedin;
    if (skills !== undefined) profile.skills = Array.isArray(skills) ? skills : skills.split(',').map((s) => s.trim());
    if (experience !== undefined) profile.experience = experience;
    if (education !== undefined) profile.education = education;

    await profile.save();
    const updatedProfile = await CandidateProfile.findOne({ user: req.user._id }).populate('user', 'name email avatar');

    res.json(updatedProfile);
  } catch (error) {
    next(error);
  }
};

// @desc    Upload candidate resume
// @route   POST /api/candidates/resume
// @access  Private (Candidate)
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a resume file (PDF/DOC)' });
    }

    let profile = await CandidateProfile.findOne({ user: req.user._id });

    if (!profile) {
      profile = new CandidateProfile({ user: req.user._id });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    profile.resume = {
      url: fileUrl,
      public_id: req.file.filename,
      fileName: req.file.originalname,
      uploadedAt: new Date(),
    };

    await profile.save();

    res.json({
      message: 'Resume uploaded successfully',
      resume: profile.resume,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCandidateProfile,
  updateCandidateProfile,
  uploadResume,
};
