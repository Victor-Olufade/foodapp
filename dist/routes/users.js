"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
const authorize_1 = require("../middleware/authorize");
const router = express_1.default.Router();
router.post('/signup', userController_1.Register);
router.post('/verify/:signature', userController_1.verifyUser);
router.post('/login', userController_1.login);
router.get('/resendotp/:signature', userController_1.requestOTP);
router.get('/get-all-users', userController_1.getAllUsers);
router.get('/myprofile', authorize_1.authorize, userController_1.getUserById);
router.patch('/updateprofile', authorize_1.authorize, userController_1.updateUserProfile);
exports.default = router;
