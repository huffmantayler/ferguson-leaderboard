import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Main from "./pages/Main";
import Login from "./pages/Login";
import PrivateRoute from "./PrivateRoute";
import Layout from "./Layout";
import { useSelector } from "react-redux";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});


function App() {
    const loggedIn = useSelector((state) => state.loggedIn);
    return (
        <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <BrowserRouter>
            <Layout />
            <Routes>
                <Route path='/' element={<Main />} />
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
            </Routes>
        </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
