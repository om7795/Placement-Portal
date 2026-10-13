import mongoose from 'mongoose';

export const APPLICATION_STATUS = [
  'applied',
  'shortlisted',
  'interview',
  'selected',
  'rejected',
  'withdrawn',
];

const timelineSchema = new mongoose.Schema(
  {
    status: { type: String, enum: APPLICATION_STATUS, required: true },
    note: { type: String, default: '' },
    at: { type: Date, default: Date.now },
    by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    resumeUrl: { type: String, default: '' },
    coverLetter: { type: String, maxlength: 2000, default: '' },
    status: { type: String, enum: APPLICATION_STATUS, default: 'applied' },
    timeline: { type: [timelineSchema], default: [] },
  },
  { timestamps: true }
);

// A student can apply to a given job only once
applicationSchema.index({ student: 1, job: 1 }, { unique: true });
applicationSchema.index({ status: 1 });

export default mongoose.model('Application', applicationSchema);
