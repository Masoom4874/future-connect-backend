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
const sequelize_1 = require("sequelize");
const User_model_1 = __importDefault(require("./User.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const MAILER_1 = require("../utils/MAILER");
const RANDOMNUMBER_1 = require("../utils/RANDOMNUMBER");
class UserService {
    createUser({ name, email, password, }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_model_1.default.create({ name, email, password });
                return user;
            }
            catch (error) {
                console.error("Error creating user:", error);
                throw error;
            }
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_model_1.default.findOne({
                    where: { email },
                });
                return user;
            }
            catch (error) {
                console.error("Error finding user by email:", error);
                throw error;
            }
        });
    }
    getAllUsersWithoutPassword() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield User_model_1.default.findAll({
                    attributes: { exclude: ["password"] },
                });
                return users;
            }
            catch (error) {
                console.error("Error fetching users:", error);
                throw error;
            }
        });
    }
    getUserByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_model_1.default.findOne({
                    where: { id },
                });
                return user;
            }
            catch (error) {
                console.error("Error fetching user by ID:", error);
                throw error;
            }
        });
    }
    sendforgetotp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let otp = (0, RANDOMNUMBER_1.generateSixDigitRandomNumber)();
                let user = yield User_model_1.default.update({
                    forgetotp: otp,
                    forgetotpexptime: new Date(),
                }, { where: { email } });
                let sentemail = yield (0, MAILER_1.sendEmail)({
                    to: email,
                    subject: "OTP FOR VERIFICATION",
                    text: `Your OTP for forget password ${otp}`,
                });
                console.log('Message sent:', sentemail.messageId);
                if (!user) {
                    return null;
                }
                return this.findUserByEmail(email);
            }
            catch (error) {
                console.error("Error finding user by email:", error);
                throw error;
            }
        });
    }
    verifyAndChangePassword(email, otp, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
                const user = yield User_model_1.default.findOne({
                    where: {
                        email,
                        forgetotp: otp,
                        forgetotpexptime: {
                            [sequelize_1.Op.gte]: fiveMinutesAgo,
                        },
                    },
                });
                if (!user) {
                    return null;
                }
                const encpass = bcrypt_1.default.hashSync(password, 1);
                User_model_1.default.update({ password: encpass }, { where: { id: user.id } });
                return user;
            }
            catch (error) {
                console.error("Error finding user by email:", error);
                throw error;
            }
        });
    }
}
exports.default = UserService;
