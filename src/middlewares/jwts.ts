import {sign, verify} from 'jsonwebtoken'
import {Request, Response, NextFunction} from 'express'
import dotenv from 'dotenv'

dotenv.config()

const jwt_key: string = process.env.JWT_SECRET || "";



export const createToken =(email: String, id: String) =>{
  const accessToken = sign({"email": email,"id": id}, jwt_key, {expiresIn: "1d"} )
  return accessToken

}

export const isAuthenticated = (req: Request, res:Response, next: NextFunction) => {
  const reqHeader = req.headers['authorization']
  
  if(!reqHeader){
    return res.status(403).json({error:"Cant cant authorization in header"})
  }
  const token = reqHeader.split(" ")[1];
  verify(token,jwt_key, (err, decodedToken)=>{
   
    console.log(decodedToken,err, "REQUEST");
    if(err){
      return res.status(403).json({error:`Invalid Token::: ${err}`})
    } else {  
      const jsonedToken = JSON.stringify(decodedToken)
      const {email, id} = JSON.parse(jsonedToken)
      req.headers['currentUser'] = id
      next()
    }
 
  });

  

}