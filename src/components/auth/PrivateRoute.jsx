import { useContext } from "react"
import { UserContext } from "../../context/Context"
import { Navigate } from "react-router-dom";

function PrivateRoute ({children}) {

    const {token} = useContext(UserContext);

    if(token !== null){
        return children
    }
    else{
        <Navigate to={'/login'}/>
    }
}

export default PrivateRoute