import Joi from 'joi';
import bcrypt from 'bcrypt';
import {AuthPayload} from '../interface';
import jwt from 'jsonwebtoken';
import {appSecret} from '../config'



export const registerSchema = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required().regex(/[A-Za-z0-9]{3,30}/),
    confirm_password: Joi.any().equal(Joi.ref('password')).required().label('confirm password').messages({'any.only': '{{#label}} does not match'}),
    phone: Joi.string().required()
})

export const updateSchema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.string().required()
})


export const adminSchema = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
    phone: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    address: Joi.string().required(),
})

export const vendorSchema = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required().regex(/[A-Za-z0-9]{3,30}/),
    phone: Joi.string().required(),
    name: Joi.string().required(),
    companyName: Joi.string().required(),
    address: Joi.string().required(),
    pin: Joi.string().required(),
})


export const option = {
    abortEarly: false,
    errors: {
        wrap: {
            label: ''
        }
    }
}

export const generateSalt = async()=>{
    return await bcrypt.genSalt()
};

export const generateHashedPassword = async(password: string, salt: string)=>{
    return await bcrypt.hash(password, salt)
};


export const generateSignature=async(payload: AuthPayload)=>{
    return jwt.sign(payload, appSecret, {expiresIn: '1d'})
}

export const verifyJwtoken=async(signature: string)=>{
    return jwt.verify(signature, appSecret)
}

export const loginSchema = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required().regex(/[A-Za-z0-9]{3,30}/),
})

export const validatePassword=async(received: string, saved: string, salt: string)=>{
    return await bcrypt.hash(received, salt) === saved;
}