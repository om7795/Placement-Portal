import Company from '../models/Company.js';
import Job from '../models/Job.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, created } from '../utils/respond.js';
import { getPagination, paged } from '../utils/paginate.js';

// @desc    List companies
// @route   GET /api/companies?q=
// @access  Private
export const listCompanies = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const { page, limit, skip } = getPagination(req.query, { defaultLimit: 20 });

  const filter = {};
  if (q) filter.name = new RegExp(q, 'i');

  const [items, total] = await Promise.all([
    Company.find(filter).sort({ name: 1 }).skip(skip).limit(limit),
    Company.countDocuments(filter),
  ]);
  return paged(res, { items, total, page, limit });
});

// @desc    Get one company + its open jobs
// @route   GET /api/companies/:id
// @access  Private
export const getCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) {
    res.status(404);
    throw new Error('Company not found');
  }
  const jobs = await Job.find({ company: company._id, status: 'open' }).sort({ createdAt: -1 });
  return ok(res, { company, jobs });
});

// @desc    Create a company
// @route   POST /api/companies
// @access  Private (admin)
export const createCompany = asyncHandler(async (req, res) => {
  const company = await Company.create({ ...req.body, createdBy: req.user._id });
  return created(res, company, 'Company created');
});

// @desc    Update a company
// @route   PUT /api/companies/:id
// @access  Private (admin)
export const updateCompany = asyncHandler(async (req, res) => {
  const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!company) {
    res.status(404);
    throw new Error('Company not found');
  }
  return ok(res, company, 'Company updated');
});

// @desc    Delete a company
// @route   DELETE /api/companies/:id
// @access  Private (admin)
export const deleteCompany = asyncHandler(async (req, res) => {
  const company = await Company.findByIdAndDelete(req.params.id);
  if (!company) {
    res.status(404);
    throw new Error('Company not found');
  }
  return ok(res, null, 'Company deleted');
});
