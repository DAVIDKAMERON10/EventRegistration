import College from '../models/College.js';
import SHS from '../models/Shs.js';
import Teacher from '../models/Teacher.js';
import QRCode from 'qrcode';
import mongoose from 'mongoose';

export const registerCollege = async (req, res) => {
  try {
    const { idNumber, firstName, middleInitial, lastName, program, yearLevel } = req.body;
    const fullName = `${firstName} ${middleInitial}. ${lastName}`;

    const qrData = `College|${idNumber}|${fullName}|${program}|Year ${yearLevel}`;
    const qrCode = await QRCode.toDataURL(qrData);

    const newParticipant = new College({ idNumber, firstName, middleInitial, lastName, program, yearLevel, qrCode });
    const saved = await newParticipant.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const registerSHS = async (req, res) => {
  try {
    const { idNumber, firstName, middleInitial, lastName, strand, year } = req.body;
    const fullName = `${firstName} ${middleInitial}. ${lastName}`;

    const qrData = `SHS|${idNumber}|${fullName}|${strand}|Year ${year} `;
    const qrCode = await QRCode.toDataURL(qrData);

    const newParticipant = new SHS({ idNumber, firstName, middleInitial, lastName, strand, year, qrCode });
    const saved = await newParticipant.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const registerTeacher = async (req, res) => {
  try {
    const { idNumber, firstName, middleInitial, lastName, department } = req.body;
    const fullName = `${firstName} ${middleInitial}. ${lastName}`;

    const qrData = `Teacher|${idNumber}|${fullName}|${department}`;
    const qrCode = await QRCode.toDataURL(qrData);

    const newTeacher = new Teacher({ idNumber, firstName, middleInitial, lastName, department, qrCode });
    const saved = await newTeacher.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getColleges = async (req, res) => {
  const list = await College.find();
  res.json(list);
};

export const getSHS = async (req, res) => {
  const list = await SHS.find();
  res.json(list);
};

export const getTeachers = async (req, res) => {
  const list = await Teacher.find();
  res.json(list);
};

export const getParticipantById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid participant ID format' });
  }

  try {
    let participant = await College.findById(id);
    if (!participant) participant = await SHS.findById(id);
    if (!participant) participant = await Teacher.findById(id);

    if (!participant) return res.status(404).json({ error: 'Participant not found' });

    res.json(participant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




// Get all participants (college, shs, teacher)
export const getAllParticipants = async (req, res) => {
  const college = await College.find();
  const shs = await SHS.find();
  const teacher = await Teacher.find();
  res.json({ college, shs, teacher });
};

// Update participant by ID and type
export const updateParticipant = async (req, res) => {
  const { id, type } = req.params;
  let model;

  if (type === 'college') model = College;
  else if (type === 'shs') model = SHS;
  else if (type === 'teacher') model = Teacher;
  else return res.status(400).json({ error: 'Invalid participant type' });

  const updated = await model.findByIdAndUpdate(id, req.body, { new: true });
  if (!updated) return res.status(404).json({ error: 'Participant not found' });

  res.json(updated);
};

// Delete participant
export const deleteParticipant = async (req, res) => {
  const { id, type } = req.params;
  let model;

  if (type === 'college') model = College;
  else if (type === 'shs') model = SHS;
  else if (type === 'teacher') model = Teacher;
  else return res.status(400).json({ error: 'Invalid participant type' });

  const deleted = await model.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ error: 'Not found' });

  res.json({ message: 'Deleted successfully' });
};









