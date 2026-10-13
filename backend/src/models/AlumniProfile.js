import mongoose from 'mongoose';

const alumniProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    graduationYear: { type: Number, required: true },
    department: {
      type: String,
      enum: ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AIML', 'Other'],
      default: 'CSE',
    },
    company: { type: String, default: '' },
    designation: { type: String, default: '' },
    location: { type: String, default: '' },
    experienceYears: { type: Number, min: 0, default: 0 },
    skills: { type: [String], default: [] },
    bio: { type: String, maxlength: 1000, default: '' },
    linkedin: { type: String, default: '' },
    isMentor: { type: Boolean, default: false },
    mentoringDomains: { type: [String], default: [] },
  },
  { timestamps: true }
);

alumniProfileSchema.index({ company: 1, department: 1, graduationYear: 1 });

export default mongoose.model('AlumniProfile', alumniProfileSchema);
