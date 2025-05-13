import mongoose from 'mongoose';

const CollegeSchema = new mongoose.Schema({
  idNumber: Number,
  firstName: String,
  middleInitial: String,
  lastName: String,
  program: String,
  yearLevel: Number,
  qrCode: String
});

export default mongoose.model('College', CollegeSchema);
