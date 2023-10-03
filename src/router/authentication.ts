import express from 'express';
import { allRoutes, getUserBalance, getUsers, login, register } from '../controllers/authentication';
import { isAuthenticated } from '../middlewares/jwts';



export default(router: express.Router) =>{
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/get-users',isAuthenticated,getUsers);
router.get('', allRoutes);
router.post('/balance', getUserBalance)

}

