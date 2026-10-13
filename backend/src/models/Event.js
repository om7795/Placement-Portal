import mongoose from 'mongoose';

export const EVENT_TYPES = ['drive', 'webinar', 'workshop', 'reunion', 'other'];

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, maxlength: 3000, default: '' },
    type: { type: String, enum: EVENT_TYPES, default: 'webinar' },
    date: { type: Date, required: true },
    endDate: { type: Date },
    location: { type: String, default: '' },
    mode: { type: String, enum: ['online', 'offline'], default: 'offline' },
    meetingLink: { type: String, default: '' },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    registrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

eventSchema.index({ date: 1 });

export default mongoose.model('Event', eventSchema);
