"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHasedPassword = exports.generateSalt = exports.option = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.registerSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required(),
    password: joi_1.default.string().required().regex(/[A-Za-z0-9]{3,30}/),
    confirm_password: joi_1.default.any().equal(joi_1.default.ref('password')).required().label('confirm password').messages({ 'any.only': '{{#label}} does not match' }),
    phone: joi_1.default.string().required()
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
const generateHasedPassword = async (password, salt) => {
    return await bcrypt_1.default.hash(password, salt);
};
exports.generateHasedPassword = generateHasedPassword;
