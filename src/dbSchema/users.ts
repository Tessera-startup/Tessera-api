import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  businessname:{type: String, required: true},
  email:{type: String, required: true},
  password: {type: String, required: true, select:false},
  phonenumber: {type: String, required: true},
  public_key: {type: String, required: true},
  private_key: {type: String, required: true, select:false},
})

export const UserModel = mongoose.model('User', UserSchema); //ModelName, SchemaName

export const getSchemaUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({email});
export const getUserById = (id: string) => UserModel.findById({_id: id});
export const createUser = (values: Record<string, any>) => new UserModel(values).save().then((user)=>user.toObject());
// export const createUser = (values: Record<string, any>) => UserModel.create(values).then((user)=>user.toObject())

export const deleteUser = (id: string) => UserModel.findOneAndDelete({_id:id});
export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values)

  