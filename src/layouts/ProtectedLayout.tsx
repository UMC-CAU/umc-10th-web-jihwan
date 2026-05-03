import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";

const ProtectedLayout = () =>{
    const {accessToken} = useAuth();
    

    if(!accessToken){
        return <Navigate to = {"/login"}replace/>;
    }
    return(
        <Outlet/>
    );
}

export default ProtectedLayout;