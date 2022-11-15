import express,{Request, Response} from 'express';
import { registerSchema, option, generateSalt, generateHasedPassword } from '../utils/util';

export const Register = async (req: Request, res: Response)=>{
try {
    const {email, phone, password, confirm_password} = req.body;
    const validateUser = registerSchema.validate(req.body, option);
    if(validateUser.error){
        return res.status(400).json({
            Error: validateUser.error.details[0].message
        })
    }
    const salt = await generateSalt();
    const userPassword = await generateHasedPassword(password, salt);
    console.log(userPassword);
} catch (error) {
    res.status(500).json({
        Error: "Internal server error",
        route: "/user/signup"
    });
}
}