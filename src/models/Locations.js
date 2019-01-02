import mongoose from 'mongoose';

/**
 * @description This is Locations schema
 */
const locationSchema = new mongoose.Schema({
  location: { type: String, required: true },
  creator: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
    name: { type: String },
  },
  sex: {
    male: { type: Number },
    female: { type: Number },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Locations = mongoose.model('Locations', locationSchema);

export default Locations;
