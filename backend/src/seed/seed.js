import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import AlumniProfile from '../models/AlumniProfile.js';
import Company from '../models/Company.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Event from '../models/Event.js';
import MentorshipRequest from '../models/MentorshipRequest.js';
import Notification from '../models/Notification.js';

dotenv.config();

const days = (n) => new Date(Date.now() + n * 24 * 60 * 60 * 1000);

async function run() {
  await connectDB(process.env.MONGO_URI);
  console.log('\n\u{1F9F9} Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    StudentProfile.deleteMany({}),
    AlumniProfile.deleteMany({}),
    Company.deleteMany({}),
    Job.deleteMany({}),
    Application.deleteMany({}),
    Event.deleteMany({}),
    MentorshipRequest.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  console.log('\u{1F465} Creating users...');
  const admin = await User.create({
    name: 'TPO Admin',
    email: 'admin@college.edu',
    password: 'admin123',
    role: 'admin',
    isApproved: true,
  });

  const student = await User.create({
    name: 'Aarav Sharma',
    email: 'student@college.edu',
    password: 'student123',
    role: 'student',
    isApproved: true,
    phone: '9876543210',
  });

  const student2 = await User.create({
    name: 'Diya Nair',
    email: 'diya@college.edu',
    password: 'student123',
    role: 'student',
    isApproved: true,
  });

  const alumni = await User.create({
    name: 'Rohan Mehta',
    email: 'alumni@college.edu',
    password: 'alumni123',
    role: 'alumni',
    isApproved: true,
  });

  const alumni2 = await User.create({
    name: 'Sneha Iyer',
    email: 'sneha@college.edu',
    password: 'alumni123',
    role: 'alumni',
    isApproved: true,
  });

  // A pending alumni to demo the admin approval flow
  await User.create({
    name: 'Kabir Verma',
    email: 'kabir@college.edu',
    password: 'alumni123',
    role: 'alumni',
    isApproved: false,
  });

  console.log('\u{1F393} Creating profiles...');
  const sp = await StudentProfile.create({
    user: student._id,
    rollNo: '20CSE001',
    department: 'CSE',
    batch: 2027,
    cgpa: 8.6,
    backlogs: 0,
    skills: ['React', 'Node.js', 'MongoDB', 'Python'],
    about: 'Final year CSE student passionate about full-stack development.',
    resumeUrl: 'https://example.com/resume/aarav.pdf',
    github: 'https://github.com/aarav',
    linkedin: 'https://linkedin.com/in/aarav',
  });

  await StudentProfile.create({
    user: student2._id,
    rollNo: '20IT014',
    department: 'IT',
    batch: 2027,
    cgpa: 9.1,
    backlogs: 0,
    skills: ['Java', 'Spring Boot', 'SQL', 'AWS'],
    resumeUrl: 'https://example.com/resume/diya.pdf',
  });

  const ap = await AlumniProfile.create({
    user: alumni._id,
    graduationYear: 2021,
    department: 'CSE',
    company: 'Google',
    designation: 'Software Engineer',
    location: 'Bengaluru',
    experienceYears: 4,
    skills: ['System Design', 'Go', 'Kubernetes'],
    bio: 'Backend engineer at Google. Happy to mentor juniors on system design.',
    linkedin: 'https://linkedin.com/in/rohan',
    isMentor: true,
    mentoringDomains: ['System Design', 'Backend', 'Interview Prep'],
  });

  await AlumniProfile.create({
    user: alumni2._id,
    graduationYear: 2019,
    department: 'IT',
    company: 'Microsoft',
    designation: 'Product Manager',
    location: 'Hyderabad',
    experienceYears: 6,
    skills: ['Product', 'Analytics', 'Leadership'],
    isMentor: true,
    mentoringDomains: ['Product Management', 'Career Guidance'],
  });

  console.log('\u{1F3E2} Creating companies...');
  const [google, microsoft, infosys, tcs] = await Company.create([
    { name: 'Google', industry: 'Technology', location: 'Bengaluru', description: 'Search, cloud, and AI products.', createdBy: admin._id },
    { name: 'Microsoft', industry: 'Technology', location: 'Hyderabad', description: 'Software, cloud, and devices.', createdBy: admin._id },
    { name: 'Infosys', industry: 'IT Services', location: 'Pune', description: 'Global IT consulting and services.', createdBy: admin._id },
    { name: 'TCS', industry: 'IT Services', location: 'Mumbai', description: 'India\u2019s largest IT services company.', createdBy: admin._id },
  ]);

  console.log('\u{1F4BC} Creating jobs...');
  const jobs = await Job.create([
    {
      title: 'Software Engineer (Frontend)',
      company: google._id,
      type: 'fulltime',
      description: 'Build delightful web experiences using React and TypeScript. Work with world-class engineers.',
      responsibilities: ['Develop UI components', 'Collaborate with designers', 'Write clean, tested code'],
      location: 'Bengaluru',
      workMode: 'hybrid',
      ctc: 24,
      skills: ['React', 'TypeScript', 'Redux', 'CSS'],
      openings: 5,
      eligibility: { minCGPA: 8.0, maxBacklogs: 0, departments: ['CSE', 'IT'], batches: [2027] },
      deadline: days(20),
      postedBy: admin._id,
      postedByRole: 'admin',
    },
    {
      title: 'Cloud Engineer Intern',
      company: microsoft._id,
      type: 'internship',
      description: 'Six-month internship on the Azure team. Learn cloud at scale.',
      responsibilities: ['Assist with cloud infrastructure', 'Write automation scripts'],
      location: 'Hyderabad',
      workMode: 'onsite',
      ctc: 60000,
      skills: ['Azure', 'Python', 'Linux'],
      openings: 3,
      eligibility: { minCGPA: 7.5, maxBacklogs: 1, departments: ['CSE', 'IT', 'ECE'], batches: [2027, 2028] },
      deadline: days(12),
      postedBy: admin._id,
      postedByRole: 'admin',
    },
    {
      title: 'Full Stack Developer',
      company: infosys._id,
      type: 'fulltime',
      description: 'Join our digital practice building MERN-stack enterprise apps.',
      location: 'Pune',
      workMode: 'onsite',
      ctc: 6.5,
      skills: ['React', 'Node.js', 'MongoDB', 'Express'],
      openings: 40,
      eligibility: { minCGPA: 6.5, maxBacklogs: 2, departments: [], batches: [2027] },
      deadline: days(30),
      postedBy: admin._id,
      postedByRole: 'admin',
    },
    {
      title: 'Backend Engineer (Referral)',
      company: google._id,
      type: 'fulltime',
      description: 'Rohan from the 2021 batch is referring candidates for the backend team.',
      location: 'Bengaluru',
      workMode: 'hybrid',
      ctc: 28,
      skills: ['Go', 'Distributed Systems', 'SQL'],
      openings: 2,
      eligibility: { minCGPA: 8.5, maxBacklogs: 0, departments: ['CSE'], batches: [2027] },
      deadline: days(15),
      postedBy: alumni._id,
      postedByRole: 'alumni',
      isReferral: true,
    },
  ]);

  console.log('\u{1F4DD} Creating applications...');
  await Application.create({
    student: student._id,
    job: jobs[0]._id,
    coverLetter: 'I would love to join Google as a frontend engineer.',
    resumeUrl: sp.resumeUrl,
    status: 'shortlisted',
    timeline: [
      { status: 'applied', note: 'Application submitted', by: student._id },
      { status: 'shortlisted', note: 'Cleared resume screening', by: admin._id },
    ],
  });
  await Job.findByIdAndUpdate(jobs[0]._id, { $inc: { applicantsCount: 1 } });

  await Application.create({
    student: student2._id,
    job: jobs[2]._id,
    coverLetter: 'Excited about the MERN stack role.',
    status: 'selected',
    timeline: [
      { status: 'applied', note: 'Application submitted', by: student2._id },
      { status: 'selected', note: 'Offer rolled out', by: admin._id },
    ],
  });
  await Job.findByIdAndUpdate(jobs[2]._id, { $inc: { applicantsCount: 1 } });
  // mark that student as placed
  await StudentProfile.findByIdAndUpdate(
    (await StudentProfile.findOne({ user: student2._id }))._id,
    { placedAt: jobs[2]._id }
  );

  console.log('\u{1F91D} Creating mentorship request...');
  await MentorshipRequest.create({
    student: student._id,
    alumni: alumni._id,
    topic: 'System Design interview preparation',
    message: 'Hi Rohan, could you guide me on preparing for system design rounds?',
    status: 'accepted',
    response: 'Sure! Let\u2019s set up a call this weekend.',
  });

  console.log('\u{1F4C5} Creating events...');
  await Event.create([
    {
      title: 'Google Campus Placement Drive 2027',
      description: 'Full-day recruitment drive for final year students.',
      type: 'drive',
      date: days(10),
      location: 'Main Auditorium',
      mode: 'offline',
      organizer: admin._id,
      company: google._id,
    },
    {
      title: 'Alumni Webinar: Life After College',
      description: 'Alumni share career journeys and answer questions.',
      type: 'webinar',
      date: days(5),
      mode: 'online',
      meetingLink: 'https://meet.example.com/alumni-webinar',
      organizer: alumni2._id,
    },
  ]);

  console.log('\u{1F514} Creating notifications...');
  await Notification.create([
    {
      user: student._id,
      title: 'Welcome to the Placement Portal',
      message: 'Complete your profile to unlock job applications.',
      type: 'system',
    },
    {
      user: student._id,
      title: 'You have been shortlisted',
      message: 'Google shortlisted you for the Frontend Engineer role.',
      type: 'application',
      link: '/applications',
    },
  ]);

  console.log('\n\u2705 Seed complete!');
  console.log('   Admin   : admin@college.edu   / admin123');
  console.log('   Student : student@college.edu / student123');
  console.log('   Alumni  : alumni@college.edu  / alumni123\n');

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error('\u274c Seed failed:', err);
  process.exit(1);
});
