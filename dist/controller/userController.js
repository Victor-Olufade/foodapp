"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Register = void 0;
const util_1 = require("../utils/util");
const Register = async (req, res) => {
    try {
        const { email, phone, password, confirm_password } = req.body;
        const validateUser = util_1.registerSchema.validate(req.body, util_1.option);
        if (validateUser.error) {
            return res.status(400).json({
                Error: validateUser.error.details[0].message
            });
        }
        const salt = await (0, util_1.generateSalt)();
        const userPassword = await (0, util_1.generateHasedPassword)(password, salt);
        console.log(userPassword);
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server error",
            route: "/user/signup"
        });
    }
};
exports.Register = Register;
