import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { deleteNote, getnote, updateNote, upload,getallnotes } from '../controllers/note.controllers.js';
import  uploadm  from '../middlewares/multer.js';
const noteroute = express.Router();

noteroute.post('/upload',isAuth,uploadm.single('file'),upload)
noteroute.get('/getnotes',isAuth,getnote)
noteroute.get('/all',isAuth,getallnotes)
noteroute.delete('/delete/:noteId',isAuth,deleteNote)
noteroute.put('/update/:noteId',isAuth,uploadm.single('file'),updateNote)
export default noteroute;
