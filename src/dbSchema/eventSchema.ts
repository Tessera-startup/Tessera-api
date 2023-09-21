import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  user_id:{type: String, required: false},
  name:{type: String, required: true},
  amount:{type: String, required: true},
  date_of_event: {type: String, required: true},
  location: {type: String, required: true},
  ticket_count: {type: String, required: true},
  is_open: {type:Boolean,default: true},
  created_at: {type: String, required: false},


 
  
})
export const EventModel = mongoose.model('Events', EventSchema); //ModelName, SchemaName
export const getAllEvents = () => EventModel.find();
export const getUserEvents = (id:string) => EventModel.find({user_id:id});
export const getEventByID = (id: string) => EventModel.findOne({_id:id});
export const createEvents = (values: Record<string, any>) => new EventModel(values).save().then((event)=>event.toObject());



const EventTicketSchema = new mongoose.Schema({
  user_id:{type: String, required: true},
  event_id:{type: String, required: true},
  customer_name:{type: String, required: true},
  amount:{type: String, required: true},
  date: {type: String, required: true},
  payer_address:{type: String, required: true},
})

export const EventTicketModel = mongoose.model('EventTicket', EventTicketSchema);
export const getEventTicketByID = (id: string) => EventTicketModel.findOne({_id:id});
export const createEventTicket= (values: Record<string, any>) => new EventTicketModel(values).save().then((ticket)=>ticket.toObject());
export const getEventTicketByBusinessID = (id: string) => EventTicketModel.find({business_id:id});
export const getEventTicketByEventID = (id: string) => EventTicketModel.find({event_id:id});


