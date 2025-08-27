import express from 'express';
import { markAttendance, getAttendanceEnhanced, getUserAttendance } from '../controller/attendance.controller';
import { authorization } from '../middleware/auth.middleware';


const AttendanceRouter= express.Router();

AttendanceRouter.post('/punch',authorization,markAttendance);
AttendanceRouter.get('/attendance',authorization,getAttendanceEnhanced);
AttendanceRouter.get('/user-attendance/:userId',authorization,getUserAttendance);

export default AttendanceRouter;