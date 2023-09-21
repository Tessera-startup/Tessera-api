import express from 'express'
import authentication from './authentication';
import eventsRouter from './eventsRouter';
const router = express.Router()

export default(): express.Router =>{
  //Auths
  authentication(router)
  //Events
  eventsRouter(router)

  return router;
};
