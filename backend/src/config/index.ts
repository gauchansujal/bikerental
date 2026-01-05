
import dotenv from 'dotenv';
dotenv.config(); 

//Application level constant and config
export const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 5050;
// IF POrt is not defined in .env use 5050 as deafulat
  export const MONGODB_URL = process.env.MONGODB_URL!;

    export const JWT_SECRET: string =  process.env.JWT_SECRET|| '97684';

    //if MONGODB-UTI is not defined in .env, use local.backup mongodb as default
