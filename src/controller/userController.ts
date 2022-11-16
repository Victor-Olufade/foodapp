import express,{Request, Response} from 'express';
import { registerSchema, option, generateSalt, generateHashedPassword, generateOtp, onOtpReq, sendEmail, eHtml, generateSignature } from '../utils';
import {UserAttribute, UserInstance} from '../model/userModel';
import {v4 as uuidv4} from 'uuid'
import {adminMail, userSubject} from '../config'

export const Register = async (req: Request, res: Response)=>{
try {
    const {email, phone, password, confirm_password} = req.body;
    const id = uuidv4()
    const validateUser = registerSchema.validate(req.body, option);
    if(validateUser.error){
        return res.status(400).json({
            Error: validateUser.error.details[0].message
        })
    }
    const salt = await generateSalt();
    const userPassword = await generateHashedPassword(password, salt);
    const {otp, expiryTime} = generateOtp();

    //check if user exists
    const User = await UserInstance.findOne({where:{email:email}})
    if(!User){
        let user = await UserInstance.create({
            id,
            email,
            password: userPassword,
            firstName: '',
            lastName: '',
            salt,
            address: '',
            phone,
            otp,
            otp_expiry: expiryTime,
            lng: 0,
            lat: 0,
            verified: false 
        })
        //send otp to user
        await onOtpReq(otp, phone);
        let html = eHtml(otp)
        await sendEmail(adminMail, email, userSubject, html)
        //check if user exists in db, if yes give him jwt signature
        const User = await UserInstance.findOne({where:{email:email}}) as unknown as UserAttribute;
        let signature = await generateSignature({
            id: User.id,
            email: User.email,
            verified: User.verified
        })
        return res.status(201).json({
            message: "User created sucessfully",
            signature
        })
    }
    return res.status(400).json({
        message: "User already exists"
    })
    
} catch (error) {
    res.status(500).json({
        Error: "Internal server error",
        route: "/user/signup"
    });
}
}