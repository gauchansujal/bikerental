import { partial } from "zod/mini";
import {UserModel, Iuser} from  "../models/user.model";
import { QueryFilter } from "mongoose";
export interface IUserRepository{ 
  getuserByEmail(email: string): Promise<Iuser | null>;
  getUserByUsername(username: string): Promise<Iuser | null>;
  //additational 
  // 5 common databse queries for enity
  createUser(useData: Partial<Iuser>): Promise<Iuser>;
  getUserById(id: string): Promise<Iuser | null>;
 getAllUsers(
        page: number, size: number, search?: string
    ): Promise<{users: Iuser[], total: number}>;
  updateUser(id: string, updsateData: Partial<Iuser>): Promise<Iuser | null >;
  deleteUser(id: string):Promise<boolean>;
}
//mongodb Implementation of userRepository
export class UserRepository implements IUserRepository{
  async getuserByEmail(email: string): Promise<Iuser | null> {
    const user = await UserModel.findOne({"email": email});
    return user;
   
  }
  async getUserByUsername(username: string): Promise<Iuser | null> {
    const user = await UserModel.findOne({"username": username});
    return user;
  }
  async createUser(useData: Partial<Iuser>): Promise<Iuser> {
    const user = new UserModel(useData);
    return await user.save();
   
  }
  async getUserById(id: string): Promise<Iuser | null> {
   const user = await UserModel.findById(id);
   return user;
  }
  async getAllUsers(page:number, size:number, search?:string): Promise<{users:Iuser[],total: number}> {
    const filter:QueryFilter<Iuser> = {};
    if(search){
      filter.$or = [
        {username:{$regex:search,$options:'i'}},
        {email: {$regex:search,$options:'i'}},
        {lastName: {$regex:search,$options:'i'}},
      ];
    }
   const [users, total] = await Promise.all([
    UserModel.find(filter).skip((page -1)*size).limit(size),
    UserModel.countDocuments(filter)
   ]);
    return {users,total};
   
  }
  async updateUser(id: string , updateData: Partial<Iuser>): Promise<Iuser | null> {
    const updateduser = await UserModel.findByIdAndUpdate(id, updateData,{new: true});//retrun teh updated document 
   return updateduser;
  }
  async deleteUser(id: string): Promise<boolean> {
    //user mdoel.deleteone ({_id : id});
    const result = await UserModel.findByIdAndDelete(id);
   return result ? true :false;
  }
}

// you should konw
// pliies of oop interface
// interface any class that implements this must have thes functions
// partial you dont need to send all fields
