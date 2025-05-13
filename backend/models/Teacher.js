import mongoose from 'mongoose';

const TeacherSchema = new mongoose.Schema({
  idNumber: String,
  firstName: String,
  middleInitial: String,
  lastName: String,
  department: String,
  qrCode: String
});

export default mongoose.model('Teacher', TeacherSchema);
