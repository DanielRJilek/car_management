import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [accessToken, setAccessToken] = useState(() => {
        const token = localStorage.getItem("token");
        return token || null;
    });   
    useEffect(() => {
        if (accessToken == null) {
            localStorage.removeItem("token");
        } else {
            localStorage.setItem("token", accessToken);
        }
    }, [accessToken])
    return (
        <AuthContext.Provider value={{accessToken,setAccessToken}}>
            {children}
        </AuthContext.Provider>
    )
}