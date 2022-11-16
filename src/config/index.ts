import {Sequelize} from 'sequelize';
import dotenv from 'dotenv'
dotenv.config()

export const db = new Sequelize('app', '', '', {
    storage: "./food.sqlite",
    dialect: "sqlite",
    logging: false
});

export const accountSid = process.env.ACCOUNTSID;
export const authToken = process.env.AUTHTOKEN;
export const adminPhone = process.env.fromAdminPhone;

export const gmailUser = process.env.gmail;
export const gmailPass = process.env.gmailPass;
export const adminMail = process.env.adminMail as string;
export const userSubject = process.env.userSubject as string;
export const appSecret = process.env.APP_SECRET as string;