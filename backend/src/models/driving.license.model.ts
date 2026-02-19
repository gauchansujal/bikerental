import mongoose, { Schema,model, Document } from "mongoose";
import { DLType } from "../types/driving.license";


export const DLSchema : Schema = new Schema<DLType>({
   

    
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
    updateAt: Date;
}
export const DLModel = model<IDL>("dl", DLSchema)