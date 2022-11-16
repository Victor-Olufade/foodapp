"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Register = void 0;
const utils_1 = require("../utils");
const userModel_1 = require("../model/userModel");
const uuid_1 = require("uuid");
const config_1 = require("../config");
const Register = async (req, res) => {
    try {
        const { email, phone, password, confirm_password } = req.body;
        const id = (0, uuid_1.v4)();
        const validateUser = utils_1.registerSchema.validate(req.body, utils_1.option);
        if (validateUser.error) {
            return res.status(400).json({
                Error: validateUser.error.details[0].message
            });
        }
        const salt = await (0, utils_1.generateSalt)();
        const userPassword = await (0, utils_1.generateHashedPassword)(password, salt);
        const { otp, expiryTime } = (0, utils_1.generateOtp)();
        //check if user exists
        const User = await userModel_1.UserInstance.findOne({ where: { email: email } });
        if (!User) {
            let user = await userModel_1.UserInstance.create({
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
            });
            //send otp to user
            await (0, utils_1.onOtpReq)(otp, phone);
            let html = (0, utils_1.eHtml)(otp);
            await (0, utils_1.sendEmail)(config_1.adminMail, email, config_1.userSubject, html);
            //check if user exists in db, if yes give him jwt signature
            const User = await userModel_1.UserInstance.findOne({ where: { email: email } });
            let signature = await (0, utils_1.generateSignature)({
                id: User.id,
                email: User.email,
                verified: User.verified
            });
            return res.status(201).json({
                message: "User created sucessfully",
                signature
            });
        }
        return res.status(400).json({
            message: "User already exists"
        });
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server error",
            route: "/user/signup"
        });
    }
};
exports.Register = Register;
