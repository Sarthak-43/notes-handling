import React, { createContext, useEffect, useState } from 'react'
import { authDatacontext } from './AuthContext';
import { useContext } from 'react';
import axios from 'axios';

export const userDataContext = createContext();

function UserContext ({children}) {

let [userData,setuserData] = useState(null);
let [notesData,setnotesData] = useState([]);
let {serverURL} = useContext(authDatacontext);

const getCurrentUser=async()=>{
    try {
        let result = await axios.get(serverURL+"/api/user/currentuser",
            {withCredentials:true})
        console.log(result.data)
        setuserData(result.data);
       
    } 
    catch (error) {
        console.log(error)
        setuserData(null)
    }
}

const getnotes = async()=>{
    try {
        let result = await axios.get(serverURL+"/api/notes/getnotes",{withCredentials:true})
        console.log(result.data)
        setnotesData(result.data)
    }
     catch (error) {
        console.log(error)
    }
}



useEffect(()=>{
    getCurrentUser(),
    getnotes()
},[])


const value={userData,setuserData,notesData,setnotesData,getnotes}

   
  return (
    <userDataContext.Provider value={value}>
        {children}
    </userDataContext.Provider>
  )
}

export default UserContext