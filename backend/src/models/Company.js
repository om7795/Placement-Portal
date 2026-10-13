import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    website: { type: String, default: '' },
    industry: { type: String, default: '' },
    description: { type: String, maxlength: 2000, default: '' },
    logo: { type: String, default: '' },
    location: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('Company', companySchema);
