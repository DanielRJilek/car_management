import { createContext, useContext, useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { AuthContext } from '../context/AuthContext';
const API_URL = "https://car-management-x6us.onrender.com";

export const UserContext = createContext();

export const UserContextProvider = ({children}) => {
    const [username, setUsername] = useState(null);  
    const [userID, setUserID] = useState(null);
    const auth = useContext(AuthContext);
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`${API_URL}/users/`, {
                    method:'GET',
                    headers: {  'Authorization': `Bearer ${localStorage.getItem("token")}`,
                                "Content-Type": "application/json", "Accept-Encoding": "gzip, deflate, br" }, 
                });
                if (!response.ok) {
                    throw new Error("Failed");
                }
                const {_id, username} = await response.json();
                setUsername(username);
                setUserID(_id);
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