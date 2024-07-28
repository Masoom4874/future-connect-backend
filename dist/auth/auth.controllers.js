"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const JWT_1 = require("../utils/JWT");
const User_model_1 = __importDefault(require("../users/User.model"));
const User_service_1 = __importDefault(require("../users/User.service"));
const userService = new User_service_1.default();
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, password } = req.body;
    const user = yield userService.findUserByEmail(email);
    if (user) {
        if (bcrypt_1.default.compareSync(password, user.password)) {
            let token = yield (0, JWT_1.createAccessToken)(user.id);
            user.password = "";
            res
                .status(200)
                .json({ success: true, result: user, token, message: "Logged in" });
        }
        else {
            res
                .status(400)
                .json({ success: false, message: "Invalid email or password" });
        }
    }
    else {
        res.status(401).json({ success: false, message: "User Not Exists" });
    }
});
exports.login = login;
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name } = req.body;
        let user = yield User_model_1.default.findOne({
            where: { email }
        });
        if (user) {
            res.status(400).json({
                success: false,
                message: "User Already Exists with this email Phone Number",
            });
        }
        else {
            const encpass = bcrypt_1.default.hashSync(password, 1);
            user = yield userService.createUser({
                email,
                password: encpass,
                name
            });
            if (user) {
                res.status(201).json({
                    success: true,
                    message: "User has been created",
                    result: user,
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    message: "unable to create user",
                });
            }
        }
    }
    catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        });
    }
});
exports.signup = signup;
