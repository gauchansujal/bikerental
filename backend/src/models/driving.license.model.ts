import mongoose, { Schema,model, Document, Types } from "mongoose";
import { DLType } from "../types/driving.license";



const DLSchema =new Schema(
   {
       user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },

   fullname: {type:String, required:true},
  
   nationalId:{type:String, required:true},
   nationalIdImageUrl:{type:String, required:true},
   drivingLicense: {type:String, required:true},
   drivingLicenseImageUrl:{type:String, required:true},
   phoneNumber:{type:String, required:true},
});
export interface IDL extends DLType, Document{

   id:mongoose.Types.ObjectId;
   createdAt: Date; 
   updatedAt: Date;
}
export const DLModel = model<IDL>("dl", DLSchema)