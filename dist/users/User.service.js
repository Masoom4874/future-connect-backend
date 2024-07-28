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
const User_model_1 = __importDefault(require("./User.model"));
class UserService {
    createUser({ name, email, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_model_1.default.create({ name, email, password });
                return user;
            }
            catch (error) {
                console.error('Error creating user:', error);
                throw error;
            }
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_model_1.default.findOne({
                    where: { email }
                });
                return user;
            }
            catch (error) {
                console.error('Error finding user by email:', error);
                throw error;
            }
        });
    }
    getAllUsersWithoutPassword() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield User_model_1.default.findAll({
                    attributes: { exclude: ['password'] }
                });
                return users;
            }
            catch (error) {
                console.error('Error fetching users:', error);
                throw error;
            }
        });
    }
}
exports.default = UserService;
