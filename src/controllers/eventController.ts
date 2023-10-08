import express, {Request, Response} from 'express'
import { EventTicketModel, createEventTicket, createEvents, getAllEvents, getAllPaidTicket, getEventByID, getEventTicketByBusinessID, getEventTicketByEventID, getUserEvents } from '../dbSchema/eventSchema'
import { createSolanaWallet, paymentListener } from '../helpers/solana.helpers';
import { getUserById } from '../dbSchema/users';
import dotenv from 'dotenv'
import { cloudinaryUpload } from '../helpers/cloudinary';
dotenv.config()



// This allows the business or the user to createEvent
export const createEventController = async(req: Request, res: Response) => {
  
  try {
    const {name, date_of_event, location, ticket_count, amount, description} = req.body
    const created_at = new Date();
    const user_id:any = req.headers['currentUser']
    const user = await getUserById(user_id)

    if (user){
        const imagePath = (req as Request)?.file?.path || ""
        const formattedImagePath = `${process.env.DOMAIN}/${imagePath}`
        const cloudUpload = await cloudinaryUpload(imagePath)
     

      
    const event = await createEvents({
      name,
      date_of_event,
      amount, 
      location,
      ticket_count, 
      user_id,
      created_at,
      description,
      image:cloudUpload.secure_url
    });
    return res.status(201).json(event)

    }
    else {
      return res.status(400).json({error: "User does not exist"})
    }

  
  } catch (error) {
    return res.status(400).json({error: error})
    
  }
}

//Fetch-ALL-Events

export const fetchAllEventsController = async(req: Request, res: Response) => {
  try {
    const event = await getAllEvents()
    return res.status(201).json(event)
  } catch (error) {
    return res.status(400).json({error: error})
    
  }
}

//Create-Event 
export const createTicketEventController = async(req:Request, res:Response) => {
  try {
    const {event_id, customer_name, amount, email} = req.body;
    const event:any = await getEventByID(event_id)
 
    const {user_id} = event

    const wallet = await createSolanaWallet();
    const date = new Date()
    const ticket = await createEventTicket({
          user_id:user_id,
          event_id,
          customer_name:customer_name,
          amount,
          date: date,
          address:wallet.public_key,
          email,
          event_name: event.name,
          address_sk: wallet.private_key
    });
    ticket.address_sk = "*****"
    //Listen to payment 
    await paymentListener(wallet.public_key)
    return res.status(200).json(ticket)
  } catch (e) {
    return res.status(400).json({error:`An error occured while trying to create ticket ${e}`})
    
  }
}
//Get-ALL-Event Belonging to a business/user
export const fetchEventsByUserIdController = async(req:Request, res:Response) => {
  const user_id = req.headers['currentUser']
  if(user_id){
  const events = await getUserEvents(user_id.toString())
  return res.status(200).json(events)
  }
  return res.status(403).json({error:"Access deneied"})
 
}

export const fetchAllPaidEventTicketsByUserId = async (req:Request, res:Response) => {
  const user_id:any = req.headers['currentUser']
  try {
    const paid_tickets = await getEventTicketByBusinessID(user_id)
     return res.status(200).json(paid_tickets)
  } catch (error) {
    return res.status(400).json({error: error})
  }

}

export const fetchAllEventTickets = async(req:Request, res:Response) => {
  try {
    const tickets = await getAllPaidTicket()
    
    return res.status(200).json(tickets)
    
  } catch (error) {
    return res.status(400).json({error: error})
    
  }
}

export const confirmTicketId = async (req:Request, res: Response) => {
  const {id} = req.body
  const ticket = await EventTicketModel.findOne({_id:id})
  if (ticket){
    return res.status(200).json({status: "Found"}) 

  } else {
    return res.status(400).json({status:"Not Found"})
  }
  
}