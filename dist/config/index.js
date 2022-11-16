"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appSecret = exports.userSubject = exports.adminMail = exports.gmailPass = exports.gmailUser = exports.adminPhone = exports.authToken = exports.accountSid = exports.db = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.db = new sequelize_1.Sequelize('app', '', '', {
    storage: "./food.sqlite",
    dialect: "sqlite",
    logging: false
});
exports.accountSid = process.env.ACCOUNTSID;
exports.authToken = process.env.AUTHTOKEN;
exports.adminPhone = process.env.fromAdminPhone;
exports.gmailUser = process.env.gmail;
exports.gmailPass = process.env.gmailPass;
exports.adminMail = process.env.adminMail;
exports.userSubject = process.env.userSubject;
exports.appSecret = process.env.APP_SECRET;
