import {accountSid, authToken, adminPhone, gmailPass, gmailUser, adminMail, userSubject} from '../config/index';
import nodemailer from 'nodemailer'



export const generateOtp =()=>{
    const otp = Math.floor(1000 + Math.random()*9000)
    const expiryTime = new Date()
    expiryTime.setTime(new Date().getTime() + (30 * 60 * 1000))
    return {otp, expiryTime}
}

export const onOtpReq =async(otp: number, phoneNumber: string)=>{
    const client = require('twilio')(accountSid, authToken);
    const response = await client.messages 
      .create({ 
         body: `Your OTP is ${otp}`,        
         to: phoneNumber,
         from: adminPhone
       })
    return response;
}

const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: gmailUser, 
        pass: gmailPass, 
      },
      tls: {
        rejectUnauthorized: false,
      }
})

export const sendEmail=async(
    from: string,
    to: string,
    subject: string,
    html: string
)=>{
    try {
        const response = await transport.sendMail({
            from: adminMail, // sender address
            to, 
            subject: userSubject, 
            html // html body
          })
          return response; 
    } catch (error) {
        console.log(error);
        
    }
};

export const eHtml=(otp: number) :string=>{
    let result = `
    <div style = "max-width:700px; margin: auto; border: 10px solid #ddd; padding: 50px, 20px; font-size: 110%;">
    <h2 style = "text-align: center; text-transform: uppercase; color: teal;">
    Welcome to Victor Store
    </h2>
    <p>
    Hi there, your OTP is ${otp}
    </p>
    </div>
    `
    return result;
}
