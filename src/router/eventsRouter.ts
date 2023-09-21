import express from 'express';
import { createEventController, fetchAllEvents } from '../controllers/eventController';
import { isAuthenticated } from '../middlewares/jwts';

export default(router: express.Router) =>{
router.post('/events/create-event',isAuthenticated,createEventController);
router.get('/events/all-events',isAuthenticated,fetchAllEvents);

}
