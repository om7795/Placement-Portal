import mongoose from 'mongoose';

const mentorshipRequestSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    alumni: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topic: { type: String, required: true, maxlength: 200 },
    message: { type: String, required: true, maxlength: 2000 },
    status: { type: String, enum: ['pending', 'accepted', 'declined', 'completed'], default: 'pending' },
    scheduledAt: { type: Date },
    response: { type: String, default: '' },
  },
  { timestamps: true }
);

mentorshipRequestSchema.index({ student: 1, alumni: 1 });

export default mongoose.model('MentorshipRequest', mentorshipRequestSchema);
