import express from 'express'
import isAuth from '../middlewares/isAuth.js'
import { currentUser } from '../controllers/user.controllers.js'
const userrouter = express.Router()
userrouter.get("/currentuser",isAuth,currentUser);
export default userrouter