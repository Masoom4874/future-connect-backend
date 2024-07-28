import { Op } from "sequelize";
import User from "./User.model";
import bcrypt from "bcrypt";
import { sendEmail } from "../utils/MAILER";
import { generateSixDigitRandomNumber } from "../utils/RANDOMNUMBER";

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

class UserService {
  public async createUser({
    name,
    email,
    password,
  }: CreateUserInput): Promise<User> {
    try {
      const user = await User.create({ name, email, password });
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  public async findUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await User.findOne({
        where: { email },
      });
      return user;
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  }

  public async getAllUsersWithoutPassword(): Promise<User[]> {
    try {
      const users = await User.findAll({
        attributes: { exclude: ["password"] },
      });
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  public async getUserByID(id: number): Promise<User | null> {
    try {
      const user = await User.findOne({
        where: { id },
      });
      return user;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }
  }

  public async sendforgetotp(email: string): Promise<User | null> {
    try {
      let otp = generateSixDigitRandomNumber();

      let user = await User.update(
        {
          forgetotp: otp,
          forgetotpexptime: new Date(),
        },
        { where: { email } }
      );

      let sentemail = await sendEmail({
        to: email,
        subject: "OTP FOR VERIFICATION",
        text: `Your OTP for forget password ${otp}`,
      });
      console.log('Message sent:', sentemail.messageId);

      if (!user) {
        return null;
      }

      return this.findUserByEmail(email);

    
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  }

  public async verifyAndChangePassword(
    email: string,
    otp: number,
    password: string
  ): Promise<User | null> {
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

      const user = await User.findOne({
        where: {
          email,
          forgetotp: otp,
          forgetotpexptime: {
            [Op.gte]: fiveMinutesAgo,
          },
        },
      });

      if (!user) {
        return null;
      }
      const encpass = bcrypt.hashSync(password, 1);

      User.update({ password: encpass }, { where: { id: user.id } });

      return user;
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  }
}

export default UserService;
