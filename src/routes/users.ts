import express from 'express';
import { login, Register, requestOTP, verifyUser } from '../controller/userController';




const router = express.Router();
router.post('/signup', Register)
router.post('/verify/:signature', verifyUser)
router.post('/login', login)
router.get('/resendotp/:signature', requestOTP)

export default router;