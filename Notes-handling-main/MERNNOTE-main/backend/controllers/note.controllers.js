import express from 'express';
import Note from '../models/note.js';
import fs from 'fs';
import uploadOnCloudinary from '../config/cloudinary.js';
import { v2 as cloudinary } from 'cloudinary'

export const upload = async (req, res) => {
    try {
        let { title, content } = req.body;
        let fileUrl = null;

        if (!title && !content) {
            return res.status(400).json({ message: "Title or content are required" });
        }

        if (req.file) {
            const file = await uploadOnCloudinary(req.file.path, "raw");
            if (!file?.secure_url) {
                return res.status(500).json({ message: "File upload failed" });
            }
            fileUrl = file.secure_url;
        }

        const result = await Note.create({
            title,
            content,
            fileUrl,
            author: req.userId
        });
        return res.status(201).json({ message: "Upload Successfull", result });
    } catch (error) {
        console.error("Upload Error:", error);
        return res.status(500).json({ message: "Upload Error" });
    }
}




export const deleteNote = async (req,res)=>{
    try {
        let {noteId} = req.params;
        if(!noteId) return res.status(400).json({message:"Note Id is required"});
        let result = await Note.findByIdAndDelete(noteId);
        if(!result) return res.status(404).json({message:"Note not found"});
        return res.status(200).json({message:"Note deleted successfully"});
    } 
    catch (error) {
        return res.status(500).json({message:"Delete Note Error"});
    }
}

export const updateNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { title, content } = req.body;
    const file = req.file;

    if (!noteId) return res.status(400).json({ message: "Note ID is required" });
    if (!title && !content && !file) return res.status(400).json({ message: "Nothing to update" });

    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ message: "Note not found" });

    let fileUrl = note.fileUrl;
    let public_id = note.public_id;

    if (file) {
      if (note.public_id) {
        try {
          await cloudinary.uploader.destroy(note.public_id, { resource_type: "raw" });
        } catch (err) {
          console.error("Cloudinary delete error:", err.message);
        }
      }

      const upload = await uploadOnCloudinary(file.path, "raw");
      if (!upload?.secure_url) {
        return res.status(500).json({ message: "Cloudinary upload failed" });
      }

      fileUrl = upload.secure_url;
      public_id = upload.public_id;

      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }

    const updateFields = {};
    if (title) updateFields.title = title;
    if (content) updateFields.content = content;
    if (fileUrl) updateFields.fileUrl = fileUrl;
    if (public_id) updateFields.public_id = public_id;

    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { $set: updateFields },
      { new: true }
    );

    return res.status(200).json({ message: "Note updated successfully", updatedNote });

  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({ message: "Update Error" });
  }
};



export const getnote = async(req,res)=>{
    try {
        const note = await Note.find({author:req.userId})
        .populate("author","firstName lastName UserName")
        .sort({createdAt:-1})
        return res.status(200).json(note)
       
    } 
    catch (error) {
        return res.status(500).json({message:"getnote error"})
    }
}



export const getallnotes = async (req,res)=>{
    try {
        const note = await Note.find().populate("author","firstName lastName UserName")
        .sort({createdAt:-1})
        return res.status(200).json(note)
       
    } 
    catch (error) {
        return res.status(500).json({message:"getnote error"})
    }
}
