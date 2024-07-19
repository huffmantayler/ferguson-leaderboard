import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Main from "./pages/Main";
import Login from "./pages/Login";
import Layout from "./Layout";
import { useSelector } from "react-redux";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';


function App() {
    const darkMode = useSelector((state) => state.darkMode)
    const loggedIn = useSelector((state) => state.loggedIn);

    const darkTheme = createTheme({
        palette: {
          mode: darkMode ? 'dark': 'light',
        },
      });


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
