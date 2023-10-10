import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  user_id:{type: String, required: false},
  name:{type: String, required: true},
  amount:{type: String, required: true},
  date_of_event: {type: String, required: true},
  location: {type: String, required: true},
  ticket_count: {type: String, required: true},
  description: {type: String, required: true},
  is_open: {type:Boolean,default: true},
  image:{type:String,required:false},
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
  event_name:{type: String, required: false},
  amount:{type: String, required: true},
  date: {type: String, required: true},
  payer_address:{type: String, required: false},
  address:{type: String, required: false},
  address_sk:{type: String, required: false},
  email:{type: String, required: true},
  is_paid: {type:Boolean,default: false},
  is_minted: {type:Boolean,default: false},
  qrcode_data:{type: String, required: false},

})

export const EventTicketModel = mongoose.model('EventTicket', EventTicketSchema);
export const getEventTicketByID = (id: string) => EventTicketModel.findOne({_id:id});
export const createEventTicket= (values: Record<string, any>) => new EventTicketModel(values).save().then((ticket)=>ticket.toObject());
export const getEventTicketByBusinessID = (id: string) => EventTicketModel.find({user_id:id, is_paid:true});
export const getEventTicketByEventID = (id: string) => EventTicketModel.findOne({event_id:id});
export const getAllPaidTicket = () => EventTicketModel.find({is_paid: true});
export const updateATicket =(address: string, status:boolean, qrcode_data: string) => EventTicketModel.findOneAndUpdate({address:address}, {is_paid:status, qrcode_data:qrcode_data})
export const getTicketByAddress =(address:string) =>EventTicketModel.findOne({address:address})


