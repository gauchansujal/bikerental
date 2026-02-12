import { CreateUserDTO, LoginUserDto, UpdateUserDto } from "../dots/user.dto";
import { UserRepository } from "../repositories/user.repository";
import bcryptjs from "bcrypt";
import {HttpError} from "../errors/http-error";
import jwt from "jsonwebtoken";
import { JWT_SECRET,  } from "../config";
import { sendEmail } from "../config/email";


let userRepository = new UserRepository();
const CLIENT_URL = process.env.CLIENT_URL as string;

export class UserService{
  async createUser(data: CreateUserDTO){
    //bussines logic before creating user
    const emailCheck = await userRepository.getuserByEmail(data.email);
    if(emailCheck){
      throw new HttpError(403, "email already in use");
    }
    const usernameCheck = await userRepository.getUserByUsername(data.username);
    if(usernameCheck){
      throw new HttpError(403, " Username already in use");
    }
    //hash password 
    const hashedPassword = await bcryptjs.hash(data.password, 10); // 10 - complesity
    data.password = hashedPassword;
    // create user
    const nweUser = await userRepository.createUser(data);
    return nweUser;
  }
  async loginUser(data: LoginUserDto){
    const user = await userRepository.getuserByEmail(data.email);
    if(!user){
      throw new HttpError(404, "user not found");
    }
    //comapred password
    const validPassword = await bcryptjs.compare(data.password, user.password);
    //plaintext hashed
    if(!validPassword){
      throw new HttpError(401, "Invalid credential");

    }
    //generate jwt
    const playload ={//user identifier
      id:user._id,
      email:user.email,
      username: user.username,
      firstname:user.firstname,
      lastName: user.lastname,
      role: user.role
      
    }
    const token = jwt.sign(playload, JWT_SECRET, {expiresIn: '30d'}); //30 day
    return {token,user}
  }
   async getUserById(userId: string) {
        const user = await userRepository.getUserById(userId);
        if (!user) {
            throw new HttpError(404, "User not found");
        }
        return user;
    }

    async updateUser(userId: string, data: UpdateUserDto) {
        const user = await userRepository.getUserById(userId);
        if (!user) {
            throw new HttpError(404, "User not found");
        }
        if(user.email !== data.email){
            const emailExists = await userRepository.getuserByEmail(data.email!);
            if(emailExists){
                throw new HttpError(403, "Email already in use");
            }
        }
        if(user.username !== data.username){
            const usernameExists = await userRepository.getUserByUsername(data.username!);
            if(usernameExists){
                throw new HttpError(403, "Username already in use");
            }
        }
        if(data.password){
            const hashedPassword = await bcryptjs.hash(data.password, 10);
            data.password = hashedPassword;
        }
        const updatedUser = await userRepository.updateUser(userId, data);
        return updatedUser;
    }
   async sendResetPasswordEmail(email?: string) {
        if (!email) {
            throw new HttpError(400, "Email is required");
        }
        const user = await userRepository.getuserByEmail(email);
        if (!user) {
            throw new HttpError(404, "User not found");
        }
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' }); // 1 hour expiry
        const resetLink = `${CLIENT_URL}/auth/reset-password?token=${token}`;
        const html = `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>`;
        await sendEmail(user.email, "Password Reset", html);
        return user;
    }

    async resetPassword(token?: string, newPassword?: string) {
        try {
            if (!token || !newPassword) {
                throw new HttpError(400, "Token and new password are required");
            }
            const decoded: any = jwt.verify(token, JWT_SECRET);
            const userId = decoded.id;
            const user = await userRepository.getUserById(userId);
            if (!user) {
                throw new HttpError(404, "User not found");
            }
            const hashedPassword = await bcryptjs.hash(newPassword, 10);
            await userRepository.updateUser(userId, { password: hashedPassword });
            return user;
        } catch (error) {
            throw new HttpError(400, "Invalid or expired token");
        }
    }
}


