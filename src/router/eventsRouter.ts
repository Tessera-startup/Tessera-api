import express from 'express';
import { confirmTicketId, createEventController, createTicketEventController, fetchAllEventTickets, fetchAllEventsController, fetchAllPaidEventTicketsByUserId, fetchEventsByUserIdController } from '../controllers/eventController';
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
router.get('/events/all-events',fetchAllEventsController);
router.get('/events/user-events',isAuthenticated,fetchEventsByUserIdController);
router.post('/events/create-event-ticket',createTicketEventController);
router.get('/events/all-event-tickets',fetchAllEventTickets);
router.post('/events/confirm-ticket',confirmTicketId);
router.get('/events/user-tickets',isAuthenticated,fetchAllPaidEventTicketsByUserId);




}
