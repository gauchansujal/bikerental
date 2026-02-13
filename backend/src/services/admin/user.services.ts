import { CreateUserDTO,LoginUserDto,UpdateUserDto } from "../../dots/user.dto";
import { UserRepository } from "../../repositories/user.repository";
import bcryptjs from "bcrypt";
import {HttpError} from "../../errors/http-error";
let userRepository =new UserRepository();
export class AdminUserServices{
    async createUser(data: CreateUserDTO){
        const emailCheck = await userRepository.getUserByUsername(data.email);
        if(emailCheck){
            throw new HttpError(403, "email already in use");

        }
        const usernameCheck = await userRepository.getUserByUsername(data.username);
        if(usernameCheck){
            throw new HttpError(403, "username already in use");

        }
        //hash password
        const hashedPassword = await bcryptjs.hash(data.password,10); //10 complixety
        data.password = hashedPassword;
        const newUser = await userRepository.createUser(data);
        return newUser;

    }
    async getAllUsers(page?: string, size?: string, search?: string
){
        const pageNumber = page ? parseInt(page) : 1;
        const pageSize = size ? parseInt(size) : 10;
        const {users, total} = await userRepository.getAllUsers(
            pageNumber, pageSize, search
        );
        const pagination = {
            page: pageNumber,
            size: pageSize,
            totalItems: total,
            totalPages: Math.ceil(total / pageSize)
        }
        return {users, pagination};

        
    }
    async deleteUser(id: string)
    {
        const user = await userRepository.getUserById(id);
         if(!user){
            throw new HttpError(404, "User not found");
        }
        const deleted = await userRepository.deleteUser(id);
        return deleted;
    }

    async updateUser(id: string, updateData: UpdateUserDto){
        const user = await userRepository.getUserById(id);
        if(!user){
            throw new HttpError(404, "User not found");
        }
    const updateduser = await userRepository.updateUser(id, updateData)
        return updateduser;
    }

    async  getUserById(id: string){
        const user = await userRepository.getUserById(id);
        if(!user){
            throw new HttpError(404, "User not found");
        }
        return user;
    }

}


