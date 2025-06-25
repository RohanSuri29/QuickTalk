import { createContext, useState } from "react"

export const UserContext = createContext();

function Context({children}) {

    const [token , setToken] = useState(localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null);
    const [user , setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {});
    const value ={user , setUser , token , setToken};

    return (

        <div>
            
            <UserContext.Provider value={value}>
                {children}
            </UserContext.Provider>
        </div>
    )
}

export default Context