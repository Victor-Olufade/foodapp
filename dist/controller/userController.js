"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestOTP = exports.login = exports.verifyUser = exports.Register = void 0;
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
                signature,
                verified: User.verified
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
//verify users
const verifyUser = async (req, res) => {
    try {
        const token = req.params.signature;
        const decode = await (0, utils_1.verifyJwtoken)(token);
        const User = await userModel_1.UserInstance.findOne({ where: { email: decode.email } });
        if (User) {
            const { otp } = req.body;
            if (User.otp === parseInt(otp) && User.otp_expiry >= new Date()) {
                const updateUser = await userModel_1.UserInstance.update({
                    verified: true
                }, { where: { email: decode.email } });
                //generate a new signature for the user
                let signature = await (0, utils_1.generateSignature)({
                    id: updateUser.id,
                    email: updateUser.email,
                    verified: updateUser.verified,
                });
                if (updateUser) {
                    const User = await userModel_1.UserInstance.findOne({ where: { email: decode.email } });
                    return res.status(200).json({
                        message: "You have successfully verfied your account",
                        signature,
                        verified: User.verified
                    });
                }
            }
            return res.status(400).json({
                Error: "Invalid credential or OTP expired"
            });
        }
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server error",
            route: "/user/verify"
        });
    }
};
exports.verifyUser = verifyUser;
//log in users
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validateUser = utils_1.loginSchema.validate(req.body, utils_1.option);
        if (validateUser.error) {
            return res.status(400).json({
                Error: validateUser.error.details[0].message
            });
        }
        const User = await userModel_1.UserInstance.findOne({ where: { email: email } });
        if (User) {
            const validation = await (0, utils_1.validatePassword)(password, User.password, User.salt);
            if (validation) {
                let signature = await (0, utils_1.generateSignature)({
                    id: User.id,
                    email: User.email,
                    verified: User.verified,
                });
                return res.status(200).json({
                    message: "You have sucessfully logged in",
                    signature,
                    email: User.email,
                    verified: User.verified
                });
            }
        }
        return res.status(400).json({
            Error: "Wrong username or password"
        });
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server error",
            route: "/user/login"
        });
    }
};
exports.login = login;
//request otp
const requestOTP = async (req, res) => {
    try {
        const token = req.params.signature;
        const decode = await (0, utils_1.verifyJwtoken)(token);
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server error",
            route: "/user/resendotp/:signature"
        });
    }
};
exports.requestOTP = requestOTP;
