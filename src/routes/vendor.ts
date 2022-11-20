import express from 'express';
import { adminRegister, superRegister } from '../controller/adminCont';
import { getAllUsers, getUserById, login, Register, requestOTP, updateUserProfile, verifyUser } from '../controller/userController';
import { authorize } from '../middleware/authorize';
import {vendorLogin} from '../controller/vendorCont'



const router = express.Router();
router.post('/vendorlogin', vendorLogin)



export default router;