import React,{createContext} from "react";
import App from "../App";
export const authDatacontext = createContext();
const serverURL = "https://mernnote-backend.onrender.com";
let value ={serverURL,}
function AuthContext({children}){
    return (
        <authDatacontext.Provider value={value}>
            {children}
        </authDatacontext.Provider>
    )
}
export default AuthContext;
