import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const loggedIn = useSelector((state) => state.loggedIn);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const auth = getAuth();

    const handleSubmit = (event) => {
        event.preventDefault();

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                dispatch({ type: "set/loggedInTrue" });
                dispatch({ type: "set/isLoginScreen", payload: false });
                localStorage.setItem("user", user);
                navigate("/");
            })
            .catch((error) => {
                setError(true);
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    useEffect(() => {
        dispatch({ type: "set/isLoginScreen", payload: true });
    }, []);

    return (
        <Container component='main' maxWidth='xs'>
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography component='h1' variant='h5'>
                    Log in
                </Typography>
                <Box
                    component='form'
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1 }}
                >
                    <TextField
                        margin='normal'
                        required
                        fullWidth
                        id='email'
                        label='Email Address'
                        name='email'
                        autoComplete='email'
                        autoFocus
                        onChange={(e) => handleEmailChange(e)}
                        error={error}
                    />
                    <TextField
                        margin='normal'
                        required
                        fullWidth
                        name='password'
                        label='Password'
                        type='password'
                        id='password'
                        autoComplete='current-password'
                        onChange={(e) => handlePasswordChange(e)}
                        error={error}
                    />
                    {error && (
                        <Typography
                            variant='subtitle2'
                            style={{ color: "red" }}
                        >
                            Incorrect Email or Password.
                        </Typography>
                    )}
                    <FormControlLabel
                        control={<Checkbox value='remember' color='primary' />}
                        label='Remember me'
                    />
                    <Button
                        type='submit'
                        fullWidth
                        variant='contained'
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Log In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href='#' variant='body2'>
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href='/signup' variant='body2'>
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;
