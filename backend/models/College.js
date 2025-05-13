import mongoose from 'mongoose';

const CollegeSchema = new mongoose.Schema({
  idNumber: String,
  firstName: String,
  middleInitial: String,
  lastName: String,
  program: String,
  yearLevel: String,
  qrCode: String
});

export default mongoose.model('College', CollegeSchema);
