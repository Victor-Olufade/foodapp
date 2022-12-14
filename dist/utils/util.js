"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassword = exports.loginSchema = exports.verifyJwtoken = exports.generateSignature = exports.generateHashedPassword = exports.generateSalt = exports.option = exports.vendorSchema = exports.adminSchema = exports.updateSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
exports.registerSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required(),
    password: joi_1.default.string().required().regex(/[A-Za-z0-9]{3,30}/),
    confirm_password: joi_1.default.any().equal(joi_1.default.ref('password')).required().label('confirm password').messages({ 'any.only': '{{#label}} does not match' }),
    phone: joi_1.default.string().required()
});
exports.updateSchema = joi_1.default.object().keys({
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    address: joi_1.default.string().required(),
    phone: joi_1.default.string().required()
});
exports.adminSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
    phone: joi_1.default.string().required(),
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    address: joi_1.default.string().required(),
});
exports.vendorSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required(),
    password: joi_1.default.string().required().regex(/[A-Za-z0-9]{3,30}/),
    phone: joi_1.default.string().required(),
    name: joi_1.default.string().required(),
    companyName: joi_1.default.string().required(),
    address: joi_1.default.string().required(),
    pin: joi_1.default.string().required(),
});
exports.option = {
    abortEarly: false,
    errors: {
        wrap: {
            label: ''
        }
    }
};
const generateSalt = async () => {
    return await bcrypt_1.default.genSalt();
};
exports.generateSalt = generateSalt;
const generateHashedPassword = async (password, salt) => {
    return await bcrypt_1.default.hash(password, salt);
};
exports.generateHashedPassword = generateHashedPassword;
const generateSignature = async (payload) => {
    return jsonwebtoken_1.default.sign(payload, config_1.appSecret, { expiresIn: '1d' });
};
exports.generateSignature = generateSignature;
const verifyJwtoken = async (signature) => {
    return jsonwebtoken_1.default.verify(signature, config_1.appSecret);
};
exports.verifyJwtoken = verifyJwtoken;
exports.loginSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required(),
    password: joi_1.default.string().required().regex(/[A-Za-z0-9]{3,30}/),
});
const validatePassword = async (received, saved, salt) => {
    return await bcrypt_1.default.hash(received, salt) === saved;
};
exports.validatePassword = validatePassword;
