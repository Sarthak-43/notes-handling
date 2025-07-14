import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {  getMessages, postMessage } from "../controllers/chat.controllers.js";
const chatrouter = express()
chatrouter.post("/send",isAuth,postMessage)
chatrouter.get("/",isAuth,getMessages)

export default chatrouter
