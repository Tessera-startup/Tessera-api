import express from 'express';
import { createEventController, createTicketEventController, fetchAllEventTickets, fetchAllEventsController, fetchEventsByIdController } from '../controllers/eventController';
import { isAuthenticated } from '../middlewares/jwts';

const multer = require('multer');


var storage = multer.diskStorage({
    destination: function (req:any, file:any, cb:any) {
      cb(null, './uploads')
    },
    filename: function (req:any, file:any, cb:any) {
      cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })
// const upload = multer({ dest: './uploads/' })


export default(router: express.Router) =>{
router.post('/events/create-event',isAuthenticated,upload.single('image'),createEventController);
router.get('/events/all-events',isAuthenticated,fetchAllEventsController);
router.get('/events/user-events',isAuthenticated,fetchEventsByIdController);
router.post('/events/create-event-ticket',createTicketEventController);
router.get('/events/all-event-tickets',fetchAllEventTickets);




}
