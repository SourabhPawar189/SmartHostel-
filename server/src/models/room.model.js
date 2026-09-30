import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true },
    hostel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true },
    floor: { type: Number, required: true, default: 1 },
    capacity: { type: Number, required: true, default: 2 },
    roomType: { type: String, enum: ['Single', 'Double', 'Triple', 'Dormitory'], default: 'Double' },
    monthlyRent: { type: Number, required: true, default: 4500 },
    isAC: { type: Boolean, default: false },
    hasAttachedBath: { type: Boolean, default: true },
  },
  { timestamps: true }
);

roomSchema.index({ roomNumber: 1, hostel: 1 }, { unique: true });

export const Room = mongoose.model('Room', roomSchema);
