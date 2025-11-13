import express from 'express';
import { signUp,login,logout,UpdatePassWord,ResetPassWord } from '../controller/auth.controller';
import { authorization,checkAuth } from '../middleware/auth.middleware';


const router= express.Router();

// signup and login routes
router.post('/signup',signUp);
router.post('/login',login);
router.get('/logout',authorization,logout);
router.get('/checkAuth',checkAuth)
router.post('/updatePassword',authorization,UpdatePassWord);
router.post('/ResetPassWord',authorization,ResetPassWord);
export default router;