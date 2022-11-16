"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eHtml = exports.sendEmail = exports.onOtpReq = exports.generateOtp = void 0;
const index_1 = require("../config/index");
const nodemailer_1 = __importDefault(require("nodemailer"));
const generateOtp = () => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    const expiryTime = new Date();
    expiryTime.setTime(new Date().getTime() + (30 * 60 * 1000));
    return { otp, expiryTime };
};
exports.generateOtp = generateOtp;
const onOtpReq = async (otp, phoneNumber) => {
    const client = require('twilio')(index_1.accountSid, index_1.authToken);
    const response = await client.messages
        .create({
        body: `Your OTP is ${otp}`,
        to: phoneNumber,
        from: index_1.adminPhone
    });
    return response;
};
exports.onOtpReq = onOtpReq;
const transport = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: index_1.gmailUser,
        pass: index_1.gmailPass,
    },
    tls: {
        rejectUnauthorized: false,
    }
});
const sendEmail = async (from, to, subject, html) => {
    try {
        const response = await transport.sendMail({
            from: index_1.adminMail,
            to,
            subject: index_1.userSubject,
            html // html body
        });
        return response;
    }
    catch (error) {
        console.log(error);
    }
};
exports.sendEmail = sendEmail;
const eHtml = (otp) => {
    let result = `
    <div style = "max-width:700px; margin: auto; border: 10px solid #ddd; padding: 50px, 20px; font-size: 110%;">
    <h2 style = "text-align: center; text-transform: uppercase; color: teal;">
    Welcome to Victor Store
    </h2>
    <p>
    Hi there, your OTP is ${otp}
    </p>
    </div>
    `;
    return result;
};
exports.eHtml = eHtml;
