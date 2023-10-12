
import { UserModel, getUserById } from "../dbSchema/users";
import { EventTicketModel, getEventByID, getEventTicketByID } from "../dbSchema/eventSchema";
import dotenv from 'dotenv'
import { cloudinaryUpload } from "./cloudinary";
import { Request, Response } from "express";
const axios = require('axios');

dotenv.config()


const { Connection, PublicKey, Keypair, LAMPORTS_PER_SOL, Transaction, sendAndConfirmTransaction, SystemProgram, getConfirmedSignaturesForAddress} = require('@solana/web3.js');
const qrcode = require('qrcode')
const bs58 = require('bs58')
dotenv.config()

export const createSolanaWallet = async () => {
const connection = new Connection('https://api.devnet.solana.com');
const walletKeypair = Keypair.generate();
const secretKey = Buffer.from(walletKeypair.secretKey)
const data = {
  public_key: walletKeypair.publicKey.toBase58(),
  private_key : bs58.encode(secretKey)
}
return  data
}


export const paymentListener = async(address:string) =>{
  const connection = new Connection("https://api.devnet.solana.com",{commitment: "confirmed", wsEndpoint:"wss://api.devnet.solana.com"});
  // const explorerConnection = new Connection("https://explorer-api.devnet.solana.com/")
  const walletAddress = new PublicKey(address);
  let account_info:any;
   

 const subsId:any = connection.onAccountChange(
  walletAddress,
  async (updatedAccountInfo:any, context:any) =>{
    account_info = JSON.stringify(updatedAccountInfo)
    const transactions = await connection.getSignaturesForAddress(walletAddress, {"limit": 1});
    for (const signature of transactions) {
      const transaction = await connection.getConfirmedTransaction(signature.signature);
      const feePayer = transaction.transaction._json.feePayer
      if(feePayer != walletAddress){
         
        const amount_in_sol = updatedAccountInfo.lamports/1000000000
        const ticketInstance = await EventTicketModel.findOne({address: walletAddress})
      
        const business = await UserModel.findOne({_id: ticketInstance?.user_id})
        await sendTransactions(ticketInstance?.address_sk, business?.public_key, amount_in_sol, connection, feePayer)
      }
          

    }
       
  },
 
  "confirmed"
);

return walletAddress
}



export const requestTestToken = async(address:string)=>{
  const connection = new Connection("https://api.devnet.solana.com");
  const pubKey = new PublicKey(address)
  const airdropSignature = await connection.requestAirdrop(
 pubKey,
  LAMPORTS_PER_SOL
);

await connection.confirmTransaction(airdropSignature);
}

export const sendTransactions = async(from_sk: any, to:any, amount:number, connection:any, feePayer:string) => {


const secret: any= from_sk // Replace with your secret key

const secretKeyPair =  Keypair.fromSecretKey(
  bs58.decode(
    secret
  )
);
(async () => {
  const balance = await connection.getBalance(secretKeyPair.publicKey);

  console.log(amount * 1000000000 * 0.92,);
    const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: secretKeyPair.publicKey,
          toPubkey: to,
          lamports: amount * 1000000000 * 0.92,
        }),
      );
  
      // Sign transaction, broadcast, and confirm
      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [secretKeyPair],
      );
      const ticket = await EventTicketModel.updateOne({address: secretKeyPair.publicKey}, {$set:{
          is_paid:true,
          payer_address: feePayer,
          amount: amount
        }}) 
     const myTicket = await EventTicketModel.findOne({address: secretKeyPair.publicKey})
     const event:any = await getEventByID(myTicket?.event_id ?? "")
     const dataToEncode = {
      "id": myTicket?.id,
      "payer_address": myTicket?.payer_address,
      "date":event.date_of_event,
      "location":event?.location,
      "is_paid":myTicket?.is_paid,
      "customer_name":myTicket?.customer_name,
      "event_name":myTicket?.event_name

     }

     qrcode.toFile(`./images/qrcodes/${myTicket?.id}.png`, JSON.stringify(dataToEncode), async(err:any) => {
       if (err) {
         console.error('Error generating QR code:', err);
        } else {
        const path:string = `${process.env.DOMAIN}/images/qrcodes/${myTicket?.id}.png`
        const cloudUpload = await cloudinaryUpload(`./images/qrcodes/${myTicket?.id}.png`)
        await EventTicketModel.updateOne({address: secretKeyPair.publicKey}, {$set:{
                      qrcode_data: cloudUpload.secure_url
         }}) 
      
      }
    });





})();


}


export const nftMinting = async (req:Request, res: Response) => {
  const {id, to} = req.body
  const tatumAPIKEY = process.env.TATUM_APIKEY
  const ticket = await getEventTicketByID(id)
  if(ticket && ticket?.is_minted == false){
   try {
     const user = await getUserById(ticket?.user_id ?? "").select('private_key + public_key')
  
     const body = {
      chain: "SOL",
       from: user?.public_key ?? "",
      fromPrivateKey: user?.private_key,
      to: `${to}`,
      metadata: {
       name: `${ticket?.event_name} NFT`,
       symbol: "TESS",
       sellerFeeBasisPoints: 0,
       uri: `${ticket?.qrcode_data}`,
       creators: [
           {
               address: `${user?.public_key}`,
               verified: true,
               share: 100
           }
       ]
   }
     }
     const headers = {'x-api-key': `${tatumAPIKEY}`,
    "Content-Type": "application/json",
    }
    const dataStringify = JSON.stringify(body)
     const mint = await axios.post('https://api.tatum.io/v3/nft/mint',dataStringify, {headers})
     const updateTicket  = await EventTicketModel.findOneAndUpdate({_id: ticket?._id},{is_minted:true})
     return res.status(200).json({data: mint.data})

    
  

  
    
   } catch (error) {
    return res.status(400).json({error:error}) 
   }

  } else {
    return res.status(400).json({error:`Ticket with this id ${id} not found or has been minted`})
  }
  
}