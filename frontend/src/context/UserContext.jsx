import { createContext, useContext, useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { AuthContext } from '../context/AuthContext';
const API_URL = import.meta.env.VITE_API_URL;

export const UserContext = createContext();

export const UserContextProvider = ({children}) => {
    const [username, setUsername] = useState(null);  
    const [userID, setUserID] = useState(null);
    const auth = useContext(AuthContext);
    useEffect(() => {
        async function fetchData() {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`${API_URL}/users`, {
                    method:'GET',
                    headers: {  'Authorization': token ? `Bearer ${token}` : "",
                                "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" }, 
                });
                if (!response.ok) {
                    setUserID("");
                    setUsername("");
                    return;
                }
                const data = await response.json();
                if (data._id && data.username) {
                    setUsername(data.username);
                    setUserID(data._id);
                } else {
                    setUserID("");
                    setUsername("");
                }
            } 
            catch (error) {
                console.log(error)
                setUserID("");
                setUsername("");
            }
        }
        fetchData();
    }, [])
    const [profilePic , setProfilePic] = useState(() => {return(CgProfile)});
    return (
        <UserContext value={{username, userID, setUsername, profilePic, setProfilePic, setUserID}}>
            {children}
        </UserContext>
    )
}