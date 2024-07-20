import { Navigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useSelector } from "react-redux";

const PrivateRoute = ({ loggedIn, children }) => {
    if (!loggedIn) {
        return <Navigate to='/login' />;
    }

    return children;
};
export default PrivateRoute;
