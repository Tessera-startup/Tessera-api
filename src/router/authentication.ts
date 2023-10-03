import express from 'express';
import { getUsers, login, register } from '../controllers/authentication';
import { isAuthenticated } from '../middlewares/jwts';



export default(router: express.Router) =>{
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/get-users',isAuthenticated,getUsers);

}

