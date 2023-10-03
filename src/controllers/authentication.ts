import express, {Request, Response} from 'express'
import { createUser, getSchemaUsers, getUserByEmail } from '../dbSchema/users';
import { hashPassword, random } from '../helpers';
import bcrypt from 'bcrypt';
import { createToken } from '../middlewares/jwts';
import { createSolanaWallet } from '../helpers/solana.helpers';
import { connection } from 'mongoose';

export const register = async(req:Request, res:Response)=>{
try {
  const {email, password, businessname, phonenumber} = req.body;
  if(!email || !password || !businessname) return res.status(400).send("Email, password and username fields are required");
   
  const existingUser = await getUserByEmail(email);
  if (existingUser) return res.status(400).json({error: "User with this email already exist"})
  const hashedPassword = hashPassword(password);
  const wallet = await createSolanaWallet()
  const user = await createUser({
    email,
    password:hashedPassword,
    businessname,
    phonenumber,
    public_key: wallet.public_key,
    private_key: wallet.private_key

  })
  user.password = "*****"
  user.private_key = "*****"
  return res.status(200).json(user).end()


  

} catch (error) {
console.log(error);
return res.status(400).send("Registration wasn't successful") 
}
}


export const login = async (req: Request, res:Response) =>{
  try {
    const {email, password} = req.body;
    if(!email || !password) return res.status(400).send("Email and password are required")
    const userInstance = await getUserByEmail(email).select('password + email + phonenumber + businessname')

    if(!userInstance){
      return res.status(400).json({error: "User is not found"})
    }
    const hashedPassword = hashPassword(password)
    if (hashedPassword != userInstance.password){
      return res.status(403).json({error: "You have entered a wrong password"})
    }
  
    const token = createToken(userInstance.email, userInstance.id);
    userInstance.password = "****"
    return res.status(200).json({user:userInstance ,accesstoken: token})


  } catch (error) {
    console.log(error, "LOGIN");
    
  }

} 


export const getUsers = async (req: Request, res:Response) =>{
  try {
    const users =  await getSchemaUsers().select('private_key');
    // users['account']:any = await connection.getBalance(users.public_key)
    return res.status(200).json(users);

  } catch (error) {
    console.log(error, "ERORR");
    return res.status(400).json({error:error})

  }

} 