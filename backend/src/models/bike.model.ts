import mongoose, { model, Schema, Document } from "mongoose";
import {  BikeType } from "../types/bike.type";
import { string } from "zod";
import { timeStamp } from "console";

const  BikeSchema : Schema = new Schema<BikeType>({ 
    //2️⃣ : Schema// This is TypeScript type annotation// 👉 It tells TypeScript that// userSchema is a Mongoose Schema// It is only for type safety (not required in JS).// 3️⃣ new Schema<UserType>()// This is where the schema is actually created./ 🔹 new Schema()// Creates a new schema object from mongoose// 🔹 <UserType>// This is a generic type
   name: {type:String,required: true },
   brand: {type:String, required: true},
   price: {type: String, required: true},
   engineCC: {type: Number, required:true},
   milage: {type: String, required: true}, 
   isAvilable : {type:Boolean,default: true },
   imageUrl: {type:String, required:false},
});

export interface Ibike extends BikeType, Document{//Ibike is the complete TypeScript type that represents one bike document after it comes from MongoDB.
    id:mongoose.Types.ObjectId;
    createdAt: Date;
    updateAt: Date;

}
export const BikeModel = model<Ibike>("Bike",BikeSchema)