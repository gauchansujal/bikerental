
import {UserService} from "../services/user.services";
import {CreateUserDTO, LoginUserDto} from "../dots/user.dto";
import {Request, Response} from "exprhess";
import z from "zod";

let userService = new UserService();


export class AuthController{
  async register(req: Request, res: Response){
    try{
      const paraseData = CreateUserDTO.safeParse(req.body);// validate request body
      if (!paraseData.success){ //valisation failde
        return res.status(400).json(
          {sucess: false, message: z.prettifyError(paraseData.error)}
        )

      }
      const userData: CreateUserDTO = paraseData.data;
      const newUser = await userService.createUser(userData);
      return res.status(201).json(
        {sucess: true, message: "user created", data: newUser}
      );
    }catch (error: Error| any){
      //expection handaling
      return res.status(error.statuseCode?? 500).json(
        {sucess: false, message: error.message|| "Internal server error"}
      );
    }
  }


  async login(req:Request, res: Response){
    try{
      const paraseData = LoginUserDto.safeParse(req.body);
      if(!paraseData.success){
        return res.status(400).json(
          {
            success: false, message:z.prettifyError(paraseData.error)
          }
            )
            const loginData :LoginUserDto = paraseData.data;
            const {token,user} =await userService.loginUser(loginData);
            return res.status(200).json(
              {success: true, message:"login successfull", data: user, token}
            );
          }
          
            

          } catch (error: Error| any){
            return res.status(error.statusCode?? 500).json(
              {success: false, message: error.message|| "internal server error"}
            )
          }
        

        
      }
}
  


