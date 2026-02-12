
import dotenv from 'dotenv';
dotenv.config(); 

//Application level constant and config
export const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 5050;
// IF POrt is not defined in .env use 5050 as deafulat
  export const MONGODB_URI: string = process.env.MONGODB_URI || 'mongodb+srv://gauchansujal0_db_user:test123@cluster0.qsdgkxi.mongodb.net/web_api';
  
  export const CLIENT_URL: string =
process.env.CLIENT_URL || 'http://localhost:3000';
   
  export const EMAIL_USER: string =
    process.env.EMAIL_USER || 'gauchansujal0@gmail.com'
  export const EMAIL_PASS:string = process.env.EMAIL_PASS || 'ratw gasn nxla xmti';

    export const JWT_SECRET: string =  process.env.JWT_SECRET|| '97684';

    //if MONGODB-UTI is not defined in .env, use local.backup mongodb as default
