"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const JWT_1 = require("../utils/JWT");
const users_controller_1 = require("./users.controller");
exports.UserRoutes = express_1.default.Router();
exports.UserRoutes.get("/users", JWT_1.verifyJwtToken, users_controller_1.users);
