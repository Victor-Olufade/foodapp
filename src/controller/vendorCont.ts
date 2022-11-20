import express,{Request, Response} from 'express';
import { option, generateSalt, generateHashedPassword, generateOtp, generateSignature, adminSchema, loginSchema, validatePassword } from '../utils';
import {UserAttribute, UserInstance} from '../model/userModel';
import {v4 as uuidv4} from 'uuid'
import {adminMail, userSubject} from '../config'
import jwt,{ JwtPayload } from 'jsonwebtoken';
import { VendorAttribute, VendorInstance } from '../model/vendorModel';


export const vendorLogin=async(req: Request, res: Response)=>{
    try {
        const {email, password} = req.body;
        const validateUser = loginSchema.validate(req.body, option);
        if(validateUser.error){
            return res.status(400).json({
                Error: validateUser.error.details[0].message
            })
        }
        const Vendor = await VendorInstance.findOne({where:{email:email}}) as unknown as VendorAttribute
        if(Vendor){
            const validation = await validatePassword(password, Vendor.password, Vendor.salt)
            if(validation){
                let signature = await generateSignature({
                    id: Vendor.id,
                    email: Vendor.email,
                    serviceAvailability: Vendor.serviceAvailability,
                });
                return res.status(200).json({
                    message: "You have sucessfully logged in",
                    signature,
                    email: Vendor.email,
                    serviceAvailability: Vendor.serviceAvailability,
                    role: Vendor.role
                })
            }
        }
        return res.status(400).json({
            Error: "Wrong username or password"
        })
    } catch (error) {
        res.status(500).json({
            Error: "Internal server error",
            route: "/vendor/vendorlogin"
        });
    }
}


