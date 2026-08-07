const RecruiterProfile = require('../models/RecruiterProfile');

// @desc    Get recruiter profile
// @route   GET /api/recruiters/profile
// @access  Private (Recruiter)
const getRecruiterProfile = async (req, res, next) => {
  try {
    let profile = await RecruiterProfile.findOne({ user: req.user._id })
      .populate('user', 'name email avatar')
      .populate('company');

    if (!profile) {
      profile = await RecruiterProfile.create({ user: req.user._id });
      profile = await profile.populate('user', 'name email avatar');
    }

    res.json(profile);
  } catch (error) {
    next(error);
  }
};

// @desc    Update recruiter profile
// @route   PUT /api/recruiters/profile
// @access  Private (Recruiter)
const updateRecruiterProfile = async (req, res, next) => {
  try {
    const { designation, phone, companyId } = req.body;

    let profile = await RecruiterProfile.findOne({ user: req.user._id });

    if (!profile) {
      profile = new RecruiterProfile({ user: req.user._id });
    }

    if (designation !== undefined) profile.designation = designation;
    if (phone !== undefined) profile.phone = phone;
    if (companyId !== undefined) profile.company = companyId;

    await profile.save();
    const updated = await RecruiterProfile.findOne({ user: req.user._id })
      .populate('user', 'name email avatar')
      .populate('company');

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecruiterProfile,
  updateRecruiterProfile,
};
