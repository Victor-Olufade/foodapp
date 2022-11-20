import express from 'express';
import { getAllUsers, getUserById, login, Register, requestOTP, updateUserProfile, verifyUser } from '../controller/userController';
import { authorize } from '../middleware/authorize';




const router = express.Router();
router.post('/signup', Register)
router.post('/verify/:signature', verifyUser)
router.post('/login', login)
router.get('/resendotp/:signature', requestOTP)
router.get('/get-all-users', getAllUsers)
router.get('/myprofile', authorize, getUserById)
router.patch('/updateprofile', authorize, updateUserProfile)

export default router;