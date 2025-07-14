import express from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import genToken from "../config/token.js";
export const signUp=async (req,res)=>{
  try {
        let {firstName,lastName,email,password,UserName}= req.body

        // Verfication of email and username
        let existEmail = await User.findOne({email})
        if(existEmail)    res.status(400).json({message:"Email Already Exist"})
        let existUserName = await User.findOne({UserName})
        if(existUserName)    res.status(400).json({message:"UserName Already Exist"})
        if(password.length<8) return res.status(400).json({message:"Password must be 8 characters"})


        let hassedpassword = await bcrypt.hash(password,10)
        const user= await User.create(
            {
                firstName,
                lastName,
                email,
                password:hassedpassword,
                UserName
            }
        )
        let token = await genToken(user._id)
        res.cookie("token",token,{
            httpOnly:true,
            maxAge:7*24*60*60*1000,
            sameSite:"strict",
            secure:process.env.NODE_ENVIRONMENT==="production"
        })

        return res.status(201).json(user)
    } 
    catch (error) {
        return res.status(500).json({message:"error"})
        console.log(error);
        
    }
        
    
}
export const login=async (req,res)=>{
    try {
        let {email,password}= req.body

        // Verfication of email and username
        const existuser = await User.findOne({email})
        if(!existuser)  return res.status(400).json({message:"User Does not Exist"})

        const isMatch = await bcrypt.compare(password,existuser.password)
        if(!isMatch) return res.status(400).json({message:'Wrong Password'})


        let token = await genToken(existuser._id)
        res.cookie("token",token,{
            httpOnly:true,
            maxAge:7*24*60*60*1000,
            sameSite:"strict",
            secure:process.env.NODE_ENVIRONMENT==="production"
        })

        return res.status(201).json(existuser)
    } 
    catch (error) {
        return res.status(500).json({message:"Login error"})
        console.log(error);
    }
}

export const logout=async (req,res)=>{
    try {
        res.clearCookie("token",{
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENVIRONMENT === "production"});
            
        return res.status(200).json({message:"Logout Successfully"})
    } catch (error) {
        return res.status(500).json({message:"Logout error"})
        console.log(error);
    }
}