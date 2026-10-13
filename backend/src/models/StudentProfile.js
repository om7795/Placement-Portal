import mongoose from 'mongoose';

const studentProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    rollNo: { type: String, trim: true },
    department: {
      type: String,
      enum: ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AIML', 'Other'],
      default: 'CSE',
    },
    degree: { type: String, default: 'B.Tech' },
    batch: { type: Number, required: true }, // graduation year, e.g. 2027
    cgpa: { type: Number, min: 0, max: 10, default: 0 },
    backlogs: { type: Number, min: 0, default: 0 },
    skills: { type: [String], default: [] },
    about: { type: String, maxlength: 1000, default: '' },
    resumeUrl: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    placedAt: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', default: null },
  },
  { timestamps: true }
);

studentProfileSchema.index({ department: 1, batch: 1 });

export default mongoose.model('StudentProfile', studentProfileSchema);
