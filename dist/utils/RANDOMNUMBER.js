"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSixDigitRandomNumber = void 0;
const generateSixDigitRandomNumber = () => {
    return Math.floor(100000 + Math.random() * 900000);
};
exports.generateSixDigitRandomNumber = generateSixDigitRandomNumber;
