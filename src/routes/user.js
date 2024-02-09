import express from 'express';
import UserController from '../controller/user.js';
import Auth from '../helper/auth.js'
const route = express.Router();

route.get('/', Auth.authenticate, Auth.adminGuard, UserController.getAllUsers);
route.get('/:id', UserController.getUserById);

route.post('/createUser', UserController.createUser);
route.post('/login', UserController.login);


export default route;