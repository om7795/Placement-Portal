import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import Company from '../models/Company.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Event from '../models/Event.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/respond.js';

// @desc    Placement dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (admin)
export const dashboardStats = asyncHandler(async (req, res) => {
  const [
    totalStudents,
    totalAlumni,
    pendingAlumni,
    totalCompanies,
    openJobs,
    totalApplications,
    selected,
    upcomingEvents,
  ] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'alumni', isApproved: true }),
    User.countDocuments({ role: 'alumni', isApproved: false }),
    Company.countDocuments(),
    Job.countDocuments({ status: 'open' }),
    Application.countDocuments(),
    Application.countDocuments({ status: 'selected' }),
    Event.countDocuments({ date: { $gte: new Date() } }),
  ]);

  const placedStudents = await StudentProfile.countDocuments({ placedAt: { $ne: null } });

  // CTC stats from selected applications (full-time only)
  const ctcAgg = await Application.aggregate([
    { $match: { status: 'selected' } },
    { $lookup: { from: 'jobs', localField: 'job', foreignField: '_id', as: 'job' } },
    { $unwind: '$job' },
    { $match: { 'job.type': 'fulltime' } },
    {
      $group: {
        _id: null,
        highestCTC: { $max: '$job.ctc' },
        averageCTC: { $avg: '$job.ctc' },
        offers: { $sum: 1 },
      },
    },
  ]);
  const ctc = ctcAgg[0] || { highestCTC: 0, averageCTC: 0, offers: 0 };

  // Top recruiters by number of selected applications
  const topRecruiters = await Application.aggregate([
    { $match: { status: 'selected' } },
    { $lookup: { from: 'jobs', localField: 'job', foreignField: '_id', as: 'job' } },
    { $unwind: '$job' },
    { $lookup: { from: 'companies', localField: 'job.company', foreignField: '_id', as: 'company' } },
    { $unwind: '$company' },
    { $group: { _id: '$company.name', offers: { $sum: 1 } } },
    { $sort: { offers: -1 } },
    { $limit: 5 },
  ]);

  // Placement split by department
  const byDepartment = await StudentProfile.aggregate([
    {
      $group: {
        _id: '$department',
        total: { $sum: 1 },
        placed: { $sum: { $cond: [{ $ne: ['$placedAt', null] }, 1, 0] } },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Application funnel by status
  const byStatus = await Application.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const placementRate = totalStudents ? Math.round((placedStudents / totalStudents) * 100) : 0;

  return ok(res, {
    totals: {
      totalStudents,
      totalAlumni,
      pendingAlumni,
      totalCompanies,
      openJobs,
      totalApplications,
      selected,
      placedStudents,
      upcomingEvents,
      placementRate,
    },
    ctc: {
      highestCTC: Number(ctc.highestCTC || 0),
      averageCTC: Number((ctc.averageCTC || 0).toFixed(2)),
      offers: ctc.offers,
    },
    topRecruiters,
    byDepartment,
    byStatus,
  });
});
