import express, {Request, Response} from 'express'
import { createEventTicket, createEvents, getAllEvents, getEventByID, getEventTicketByBusinessID } from '../dbSchema/eventSchema'

// This allows the business or the user to createEvent
export const createEventController = async(req: Request, res: Response) => {
  
  try {
    const {name, date_of_event, location, ticket_count, amount} = req.body
    const created_at = new Date();
    const user_id = req.headers['currentUser']
    const event = await createEvents({
      name,
      date_of_event,
      amount, 
      location,
      ticket_count, 
      user_id,
      created_at
    });
    return res.status(201).json(event)
  } catch (error) {
    return res.status(400).json({error: error})
    
  }
}

export const fetchAllEvents = async(req: Request, res: Response) => {
  
  try {
    
   
    const event = await getAllEvents()
    return res.status(201).json(event)
  } catch (error) {
    return res.status(400).json({error: error})
    
  }
}