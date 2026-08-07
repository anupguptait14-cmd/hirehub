const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const CandidateProfile = require('./models/CandidateProfile');
const RecruiterProfile = require('./models/RecruiterProfile');
const Company = require('./models/Company');
const Job = require('./models/Job');
const Application = require('./models/Application');
const Notification = require('./models/Notification');
const SavedJob = require('./models/SavedJob');

const seedData = require('./utils/seedData');

const seedDatabase = async () => {
  let uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hirehub';

  if (uri.includes('<YOUR_PASSWORD>') || uri.includes('<db_password>')) {
    console.warn('⚠️ MONGODB_URI contains password placeholder. Falling back to local MongoDB at mongodb://127.0.0.1:27017/hirehub');
    uri = 'mongodb://127.0.0.1:27017/hirehub';
  }

  try {
    console.log(`Connecting to database at ${uri}...`);
    await mongoose.connect(uri);

    console.log('Clearing existing database collections...');
    await User.deleteMany();
    await CandidateProfile.deleteMany();
    await RecruiterProfile.deleteMany();
    await Company.deleteMany();
    await Job.deleteMany();
    await Application.deleteMany();
    await Notification.deleteMany();
    await SavedJob.deleteMany();

    console.log('Inserting seed users...');
    const createdUsers = await User.create(seedData.users);

    const adminUser = createdUsers.find((u) => u.role === 'admin');
    const recruiterUser1 = createdUsers.find((u) => u.email === 'recruiter@techcorp.com');
    const recruiterUser2 = createdUsers.find((u) => u.email === 'recruiter@innotech.com');
    const candidateUser1 = createdUsers.find((u) => u.email === 'aarav@candidate.com');
    const candidateUser2 = createdUsers.find((u) => u.email === 'ananya@candidate.com');

    console.log('Creating Candidate Profiles...');
    await CandidateProfile.create([
      {
        user: candidateUser1._id,
        headline: 'Senior Full Stack MERN Engineer | React & Node Specialist',
        bio: 'Passionate MERN stack developer with 5+ years of experience building scalable web apps in Bengaluru.',
        location: 'Bengaluru, Karnataka',
        phone: '+91 98765 43210',
        skills: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'Docker'],
        website: 'https://aaravpatel.dev',
        github: 'https://github.com/aaravpatel',
        linkedin: 'https://linkedin.com/in/aaravpatel',
      },
      {
        user: candidateUser2._id,
        headline: 'Frontend Developer & UI/UX Specialist',
        bio: 'Creating modern, responsive user experiences with React, Next.js, and glassmorphism design system.',
        location: 'Mumbai, Maharashtra',
        phone: '+91 98765 43211',
        skills: ['React.js', 'TypeScript', 'Tailwind CSS', 'Figma', 'Next.js'],
      },
    ]);

    console.log('Inserting Companies...');
    const company1 = await Company.create({
      ...seedData.companies[0],
      createdBy: recruiterUser1._id,
      user: recruiterUser1._id,
    });

    const company2 = await Company.create({
      ...seedData.companies[1],
      createdBy: recruiterUser2._id,
      user: recruiterUser2._id,
    });

    console.log('Creating Recruiter Profiles...');
    await RecruiterProfile.create([
      {
        user: recruiterUser1._id,
        company: company1._id,
        designation: 'Senior Talent Acquisition Lead',
        phone: '+91 98765 43212',
      },
      {
        user: recruiterUser2._id,
        company: company2._id,
        designation: 'Head of Engineering Recruitment',
        phone: '+91 98765 43213',
      },
    ]);

    console.log('Inserting Job Listings...');
    const jobsToInsert = seedData.jobs.map((j, idx) => ({
      ...j,
      postedBy: idx % 2 === 0 ? recruiterUser1._id : recruiterUser2._id,
      company: idx % 2 === 0 ? company1._id : company2._id,
      salaryCurrency: 'INR',
    }));
    const createdJobs = await Job.create(jobsToInsert);

    console.log('Creating Sample Applications...');
    await Application.create({
      job: createdJobs[0]._id,
      candidate: candidateUser1._id,
      recruiter: recruiterUser1._id,
      status: 'Applied',
      resume: {
        url: 'https://example.com/sample_resume.pdf',
        fileName: 'Aarav_Patel_Resume.pdf',
      },
      coverLetter: 'I am excited to apply for the Senior MERN Stack Developer role in Bengaluru.',
    });

    console.log('Creating Sample Notifications...');
    await Notification.create({
      recipient: candidateUser1._id,
      title: 'Welcome to HireHub India!',
      message: 'Your candidate account has been created cleanly. Start exploring high-paying job opportunities in Bengaluru, Mumbai, and Remote.',
    });

    console.log('Database Seeded Successfully!');
    console.log('--------------------------------------------------');
    console.log('DEMO CREDENTIALS:');
    console.log('1. Admin:     email: admin@hirehub.com    pass: password123');
    console.log('2. Recruiter: email: recruiter@techcorp.com pass: password123');
    console.log('3. Candidate: email: aarav@candidate.com  pass: password123');
    console.log('--------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Error Seeding Database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
