import mongoose from 'mongoose';

const SHSSchema = new mongoose.Schema({
  idNumber: Number,
  firstName: String,
  middleInitial: String,
  lastName: String,
  strand: String,
  year: Number,
  qrCode: String
});

export default mongoose.model('SHS', SHSSchema);
