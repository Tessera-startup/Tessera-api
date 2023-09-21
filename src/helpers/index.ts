import crypto from 'crypto'
import dotenv from 'dotenv'
import {Request} from 'express'
dotenv.config()

const secret: string = process.env.PASSWORD_HASH_KEY || ""
export const random = () => crypto.randomBytes(128).toString('base64');
export const hashPassword = (password: string) => {
  return crypto.createHmac('sha256', [password].join('/')).update(secret).digest('hex');
};
 

