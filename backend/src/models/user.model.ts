import mongoose, { Schema,  model,Document } from "mongoose";
// import bcrypt from "bcrypyjs";
import { UserType } from "../types/user.type";
import { timeStamp } from "console";
const userSchema: Schema = new Schema<UserType>(
{
  email: {type:String, required: true, unique: true},
  password:{type:String, required: true},
  username: {type:String, required: true, unique:true},
  firstname: {type: String},
  lastname: {type: String},
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  imageUrl: {type:String,required: false},
},
{ 
  timestamps:true, //auto createAt and updateAt
  }
    
);

export interface Iuser extends UserType, Document{
  //combine usertype and document 
  id:mongoose.Types.ObjectId; //mongo related attribute/custome attributes
  createdAt: Date;
  updateAt: Date;
}
export const UserModel = model<Iuser>("User", userSchema);// it creat mongodb model called user this model lets you talk to the database 

// const userSchema = new Schema<IUser>( this thngs are inside user.tye.ts
//   {

//     firstname:{
//       type:String,
//       required: true,
//       trim: true,
//       minlength:[2, "firstname must be at least 2 character"]


//     },
//     lastname:{
//       type: String,
//       required:true,
//       trim: true,
//       minlength: [2, "last name should be at least 2 character"]
//     },

//     username:{
//       type:String,
//       required: [true, "username is required"],
//       unique: true,
//       trim: true,
//       lowercase: true,
//       minlength: [3, "atlest 3 char needed"],
//       maxlength: [10, "username cannot exceed 10 numbers"],
//       match: [/^[a-zA-Z0-9_]+$/, "username can only contain letters, numbers and underscores",],



//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     role: {
//       type: String,
//       enum: ["user", "admin"],
//       default: "user",
//     },
//   },
//   { timestamps: true, 
//     toJSON:{virtuals: true},
//     toObject:{virtuals: true},
//   }
// );
// hash password before saving 
// userSchema.pre("save", async function (next){
//   if(!this.isModified("password"))return next();
//   try{
//     const salt = await bcrypt.genSalt(12);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   }catch (error: any){
//     next(error);

//   }
// });

//helper method for login (comapre plain vs hansed)
// userSchema.methods.comaprePassword=async function(condiatePassword :string):Promise<boolean>{
//   return bcrypt.compare(candidatePassword, this.password);
// }
