import express from 'express';
import { registerCollege, 
         registerSHS, 
         registerTeacher, 
         getColleges, 
         getSHS, 
         getTeachers, 
         getAllParticipants,
         getParticipantById,
        //  updateParticipant,
         deleteParticipant } from '../controllers/participantControllers.js';

const router = express.Router();

router.post('/college', registerCollege);
router.post('/shs', registerSHS);
router.post('/teacher', registerTeacher);

router.get('/college', getColleges);
router.get('/shs', getSHS);
router.get('/teacher', getTeachers);


router.get('/all', getAllParticipants);
router.get('/:id', getParticipantById);
router.put('/:type/:id', updateParticipant);
router.delete('/:type/:id', deleteParticipant);


export default router;
