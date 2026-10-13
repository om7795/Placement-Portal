import mongoose from 'mongoose';

export const JOB_TYPES = ['fulltime', 'internship'];

const eligibilitySchema = new mongoose.Schema(
  {
    minCGPA: { type: Number, default: 0 },
    maxBacklogs: { type: Number, default: 0 },
    departments: { type: [String], default: [] }, // empty = open to all
    batches: { type: [Number], default: [] }, // empty = all batches
  },
  { _id: false }
);

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    type: { type: String, enum: JOB_TYPES, default: 'fulltime' },
    description: { type: String, required: true, maxlength: 5000 },
    responsibilities: { type: [String], default: [] },
    location: { type: String, default: '' },
    workMode: { type: String, enum: ['onsite', 'remote', 'hybrid'], default: 'onsite' },
    ctc: { type: Number, default: 0 }, // LPA for fulltime, monthly stipend for internship
    currency: { type: String, default: 'INR' },
    skills: { type: [String], default: [] },
    openings: { type: Number, default: 1 },
    eligibility: { type: eligibilitySchema, default: () => ({}) },
    deadline: { type: Date },
    // Posted by an admin/TPO or an alumni referral
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postedByRole: { type: String, enum: ['admin', 'alumni'], default: 'admin' },
    isReferral: { type: Boolean, default: false },
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    applicantsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

jobSchema.index({ title: 'text', description: 'text', skills: 'text' });

export default mongoose.model('Job', jobSchema);
