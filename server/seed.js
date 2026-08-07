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
const SavedJob = require('./models/SavedJob');
const Notification = require('./models/Notification');
const PasswordResetToken = require('./models/PasswordResetToken');

const seedData = require('./utils/seedData');

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hirehub';
    console.log(`Connecting to database at ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing database collections...');
    await User.deleteMany();
    await CandidateProfile.deleteMany();
    await RecruiterProfile.deleteMany();
    await Company.deleteMany();
    await Job.deleteMany();
    await Application.deleteMany();
    await SavedJob.deleteMany();
    await Notification.deleteMany();
    await PasswordResetToken.deleteMany();

    console.log('Inserting seed users...');
    const createdUsers = await User.create(seedData.users);

    const adminUser = createdUsers.find((u) => u.role === 'admin');
    const recruiter1 = createdUsers.find((u) => u.email === 'recruiter@techcorp.com');
    const recruiter2 = createdUsers.find((u) => u.email === 'recruiter@innotech.com');
    const candidate1 = createdUsers.find((u) => u.email === 'aarav@candidate.com');
    const candidate2 = createdUsers.find((u) => u.email === 'ananya@candidate.com');

    console.log('Creating Candidate Profiles...');
    await CandidateProfile.create({
      user: candidate1._id,
      headline: 'Full Stack MERN Developer | React & Node Specialist',
      bio: 'Passionate software engineer with 4 years experience building high-performance web applications in React, Express, Node.js, and MongoDB.',
      location: 'Bengaluru, Karnataka',
      phone: '+91 98765 43210',
      website: 'https://aaravpatel.dev',
      github: 'https://github.com/aaravpatel',
      linkedin: 'https://linkedin.com/in/aaravpatel',
      skills: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'TypeScript', 'Docker'],
      resume: {
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileName: 'Aarav_Patel_Resume.pdf',
        uploadedAt: new Date(),
      },
      experience: [
        {
          company: 'CloudTech Solutions India',
          position: 'Full Stack Developer',
          location: 'Bengaluru, Karnataka',
          startDate: '2022-01',
          endDate: '2024-06',
          current: false,
          description: 'Developed scalable microservices and portal dashboards.',
        },
      ],
      education: [
        {
          institution: 'Indian Institute of Technology (IIT) Bombay',
          degree: 'B.Tech Computer Science & Engineering',
          startYear: '2017',
          endYear: '2021',
        },
      ],
    });

    await CandidateProfile.create({
      user: candidate2._id,
      headline: 'Frontend UI/UX Developer & React Specialist',
      bio: 'UI Engineer specializing in interactive React web apps, design systems, and responsive user experiences.',
      location: 'Mumbai, Maharashtra',
      phone: '+91 91234 56789',
      skills: ['React.js', 'Tailwind CSS', 'Figma', 'JavaScript', 'HTML5', 'Redux'],
      resume: {
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileName: 'Ananya_Gupta_Resume.pdf',
        uploadedAt: new Date(),
      },
    });

    console.log('Inserting Companies...');
    const company1 = await Company.create({
      ...seedData.companies[0],
      createdBy: recruiter1._id,
    });

    const company2 = await Company.create({
      ...seedData.companies[1],
      createdBy: recruiter2._id,
    });

    const company3 = await Company.create({
      ...seedData.companies[2],
      createdBy: recruiter1._id,
    });

    console.log('Creating Recruiter Profiles...');
    await RecruiterProfile.create({
      user: recruiter1._id,
      company: company1._id,
      designation: 'Lead Talent Acquisition Partner',
      phone: '+91 98765 11111',
    });

    await RecruiterProfile.create({
      user: recruiter2._id,
      company: company2._id,
      designation: 'Senior Technical Recruiter',
      phone: '+91 98765 22222',
    });

    console.log('Inserting Job Listings...');
    const job1 = await Job.create({
      ...seedData.jobs[0],
      company: company1._id,
      postedBy: recruiter1._id,
    });

    const job2 = await Job.create({
      ...seedData.jobs[1],
      company: company2._id,
      postedBy: recruiter2._id,
    });

    const job3 = await Job.create({
      ...seedData.jobs[2],
      company: company3._id,
      postedBy: recruiter1._id,
    });

    const job4 = await Job.create({
      ...seedData.jobs[3],
      company: company1._id,
      postedBy: recruiter1._id,
    });

    console.log('Creating Sample Applications...');
    const app1 = await Application.create({
      job: job1._id,
      candidate: candidate1._id,
      recruiter: recruiter1._id,
      resume: {
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileName: 'Aarav_Patel_Resume.pdf',
      },
      coverLetter: 'I am excited to apply for the Senior Full Stack Engineer position. My 4 years of hands-on experience in MERN stack development aligns perfectly with your requirements.',
      status: 'Shortlisted',
      notes: 'Strong candidate with impressive React & Node project portfolio.',
      statusHistory: [
        { status: 'Applied', note: 'Application submitted', updatedAt: new Date(Date.now() - 86400000 * 3) },
        { status: 'Under Review', note: 'Resume screened', updatedAt: new Date(Date.now() - 86400000 * 2) },
        { status: 'Shortlisted', note: 'Scheduled for technical interview', updatedAt: new Date(Date.now() - 86400000) },
      ],
    });

    job1.applicationsCount = 1;
    await job1.save();

    console.log('Creating Sample Notifications...');
    await Notification.create({
      recipient: candidate1._id,
      sender: recruiter1._id,
      type: 'application_status',
      title: 'Application Status Update',
      message: 'Your application status for "Senior Full Stack Engineer (MERN)" has been updated to "Shortlisted".',
      link: '/candidate/applications',
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
    console.error(`Error Seeding Database: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
