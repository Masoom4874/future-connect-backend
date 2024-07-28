
import { Request, Response } from "express";
import UserService from "./User.service";



const userService = new UserService()


export const users = async (req: Request, res: Response) => {
    try {
        let users = await userService.getAllUsersWithoutPassword();


        if (users) {
            res.status(200).json({
                success: true,
                message: "List of All Users",
                result: users,
            });
        } else {
            res.status(301).json({
                success: false,
                message: "No Users found",
            });
        }

    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        });
    }
};