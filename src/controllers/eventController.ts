import express, {Request, Response} from 'express'
import { createEventTicket, createEvents, getAllEvents, getAllPaidTicket, getEventByID, getEventTicketByBusinessID, getEventTicketByEventID } from '../dbSchema/eventSchema'
import { createSolanaWallet, paymentListener } from '../helpers/solana.helpers';


// This allows the business or the user to createEvent
export const createEventController = async(req: Request, res: Response) => {
  
  try {
    const {name, date_of_event, location, ticket_count, amount} = req.body
    const created_at = new Date();
    console.log(req.body);
    const user_id = req.headers['currentUser']
    const imagePath = (req as Request)?.file?.path || ""
    const event = await createEvents({
      name,
      date_of_event,
      amount, 
      location,
      ticket_count, 
      user_id,
      created_at,
      image:imagePath
    });
    return res.status(201).json(event)
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
export const fetchEventsByIdController = async(req:Request, res:Response) => {
  const user_id = req.headers['currentUser']
  if(user_id){
  const events = await getEventByID(user_id.toString())
  return res.sendStatus(200).json(events)
  }
  return res.sendStatus(403).json({error:"Access deneied"})
 
}

export const fetchAllEventTicketsByBusinessId = async () => {

}

export const fetchAllEventTickets = async(req:Request, res:Response) => {
  try {
    const tickets = await getAllPaidTicket()
    
    return res.status(200).json(tickets)
    
  } catch (error) {
    return res.status(400).json({error: error})
    
  }
}