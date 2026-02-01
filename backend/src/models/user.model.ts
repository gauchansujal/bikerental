import { Schema, model, Document } from "mongoose";
import { lowercase, minSize } from "zod";

export interface IUser extends Document {
  firstname: string;
  lastname:string;
  username:string;

  email: string;
  password: string;
  confrimpassword: string;
  role: "user" | "admin";
}

const userSchema = new Schema<IUser>(
  {

    firstname:{
      type:String,
      required: true,
      trim: true,
      minlength:[2, "firstname must be at least 2 character"]


    },
    lastname:{
      type: String,
      required:true,
      trim: true,
      minlength: [2, "last name should be at least 2 character"]
    },

    username:{
      type:String,
      required: [true, "username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "atlest 3 char needed"],
      maxlength: [10, "username cannot exceed 10 numbers"],
      match: [/^[a-zA-Z0-9_]+$/, "username can only contain letters, numbers and underscores",],



    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

export const UserModel = model<IUser>("User", userSchema);
