import express from 'express';
import { markAttendance,GetPunchOut,markPunchOut,getUserAttendance } from '../controller/attendance.controller';
import { authorization } from '../middleware/auth.middleware';


const AttendanceRouter= express.Router();

AttendanceRouter.post('/punch',authorization,markAttendance);
AttendanceRouter.get('/GetPunchOut',authorization,GetPunchOut);
AttendanceRouter.post('/punchOut',authorization,markPunchOut);
// AttendanceRouter.get('/attendance',authorization,getAttendanceEnhanced);
AttendanceRouter.get('/userAttendance',authorization,getUserAttendance);

export default AttendanceRouter;