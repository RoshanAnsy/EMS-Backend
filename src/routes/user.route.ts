import express from 'express';
import { getUserLogs,getAllUsers, GetUser } from '../controller/user.controller';
import { authorization } from '../middleware/auth.middleware';

const router= express.Router();

router.get('/getUserLogs',authorization,getUserLogs);
router.get('/getAllUsers', authorization,getAllUsers);
router.get("/getUser",authorization,GetUser)

export default router;