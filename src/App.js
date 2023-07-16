import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Main from "./pages/Main";
import Login from "./pages/Login";
import PrivateRoute from "./PrivateRoute";
import Layout from "./Layout";
import { useSelector } from "react-redux";

function App() {
    const loggedIn = useSelector((state) => state.loggedIn);
    return (
        <BrowserRouter>
            <Layout />
            <Routes>
                <Route path='/' element={<Main />} />
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
