import express from 'express';
import { adminRegister, createVendor, superRegister } from '../controller/adminCont';
import { getAllUsers, getUserById, login, Register, requestOTP, updateUserProfile, verifyUser } from '../controller/userController';
import { authorize } from '../middleware/authorize';




const router = express.Router();
router.post('/signup', authorize, adminRegister)
router.post('/supersignup', superRegister)
router.post('/createvendor', authorize, createVendor)


export default router;