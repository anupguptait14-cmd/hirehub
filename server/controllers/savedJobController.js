const SavedJob = require('../models/SavedJob');

// @desc    Get user saved jobs
// @route   GET /api/saved-jobs
// @access  Private (Candidate)
const getSavedJobs = async (req, res, next) => {
  try {
    const savedJobs = await SavedJob.find({ user: req.user._id })
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'name logo location industry' },
      })
      .sort('-createdAt');

    res.json(savedJobs);
  } catch (error) {
    next(error);
  }
};

// @desc    Save job
// @route   POST /api/saved-jobs/:jobId
// @access  Private (Candidate)
const saveJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const existing = await SavedJob.findOne({ user: req.user._id, job: jobId });
    if (existing) {
      return res.status(400).json({ message: 'Job is already saved' });
    }

    const saved = await SavedJob.create({
      user: req.user._id,
      job: jobId,
    });

    res.status(201).json(saved);
  } catch (error) {
    next(error);
  }
};

// @desc    Unsave job
// @route   DELETE /api/saved-jobs/:jobId
// @access  Private (Candidate)
const unsaveJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    await SavedJob.deleteOne({ user: req.user._id, job: jobId });

    res.json({ message: 'Job removed from saved jobs' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSavedJobs,
  saveJob,
  unsaveJob,
};
