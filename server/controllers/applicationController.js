const Application = require('../models/Application');
const Job = require('../models/Job');
const CandidateProfile = require('../models/CandidateProfile');
const Notification = require('../models/Notification');

// @desc    Apply to a job listing
// @route   POST /api/applications
// @access  Private (Candidate)
const applyToJob = async (req, res, next) => {
  try {
    const { jobId, coverLetter } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job listing not found' });
    }

    if (job.status !== 'active') {
      return res.status(400).json({ message: 'This job listing is no longer accepting applications' });
    }

    // Check existing application
    const existingApp = await Application.findOne({
      job: jobId,
      candidate: req.user._id,
    });

    if (existingApp) {
      return res.status(400).json({ message: 'You have already applied for this job listing' });
    }

    let resumeUrl = '';
    let resumeFileName = 'Resume.pdf';

    if (req.file) {
      resumeUrl = `/uploads/${req.file.filename}`;
      resumeFileName = req.file.originalname;
    } else {
      const candidateProf = await CandidateProfile.findOne({ user: req.user._id });
      if (candidateProf && candidateProf.resume && candidateProf.resume.url) {
        resumeUrl = candidateProf.resume.url;
        resumeFileName = candidateProf.resume.fileName || 'Resume.pdf';
      }
    }

    if (!resumeUrl) {
      return res.status(400).json({ message: 'Please upload a resume or add a resume to your candidate profile' });
    }

    const application = await Application.create({
      job: job._id,
      candidate: req.user._id,
      recruiter: job.postedBy,
      resume: {
        url: resumeUrl,
        fileName: resumeFileName,
      },
      coverLetter: coverLetter || '',
      status: 'Applied',
      statusHistory: [{ status: 'Applied', note: 'Application submitted' }],
    });

    // Increment job application count
    job.applicationsCount += 1;
    await job.save();

    // Create notification for recruiter
    await Notification.create({
      recipient: job.postedBy,
      sender: req.user._id,
      type: 'new_application',
      title: 'New Job Application',
      message: `${req.user.name} applied for "${job.title}"`,
      link: `/recruiter/jobs/${job._id}/applicants`,
    });

    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
};

// @desc    Get candidate's submitted applications
// @route   GET /api/applications/my-applications
// @access  Private (Candidate)
const getCandidateApplications = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = { candidate: req.user._id };

    if (status) {
      query.status = status;
    }

    const applications = await Application.find(query)
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'name logo location' },
      })
      .sort('-createdAt');

    res.json(applications);
  } catch (error) {
    next(error);
  }
};

// @desc    Get applicants for a specific job (recruiter view)
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter / Admin)
const getJobApplications = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { status, search } = req.query;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job listing not found' });
    }

    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view applicants for this job' });
    }

    const query = { job: jobId };
    if (status) {
      query.status = status;
    }

    let applications = await Application.find(query)
      .populate({
        path: 'candidate',
        select: 'name email avatar',
      })
      .sort('-createdAt');

    // Populate candidate profile details
    const candidateIds = applications.map((app) => app.candidate._id);
    const profiles = await CandidateProfile.find({ user: { $in: candidateIds } });
    const profileMap = new Map(profiles.map((p) => [p.user.toString(), p]));

    const result = applications.map((app) => {
      const appObj = app.toObject();
      appObj.candidateProfile = profileMap.get(app.candidate._id.toString()) || null;
      return appObj;
    });

    if (search) {
      const lowerSearch = search.toLowerCase();
      const filtered = result.filter(
        (app) =>
          app.candidate.name.toLowerCase().includes(lowerSearch) ||
          app.candidate.email.toLowerCase().includes(lowerSearch) ||
          (app.candidateProfile &&
            app.candidateProfile.skills.some((s) => s.toLowerCase().includes(lowerSearch)))
      );
      return res.json(filtered);
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status & recruiter notes
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter / Admin)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;

    const application = await Application.findById(req.params.id)
      .populate('job', 'title')
      .populate('candidate', 'name email');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    if (status) {
      application.status = status;
      application.statusHistory.push({
        status,
        note: note || `Status updated to ${status}`,
      });
    }

    if (note !== undefined) {
      application.notes = note;
    }

    await application.save();

    // Create notification for candidate
    if (status) {
      await Notification.create({
        recipient: application.candidate._id,
        sender: req.user._id,
        type: 'application_status',
        title: 'Application Status Update',
        message: `Your application status for "${application.job.title}" has been updated to "${status}".`,
        link: '/candidate/applications',
      });
    }

    res.json(application);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyToJob,
  getCandidateApplications,
  getJobApplications,
  updateApplicationStatus,
};
