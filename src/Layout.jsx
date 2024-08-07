import { Menu as MenuIcon, AccountCircle } from "@mui/icons-material";
import {
    AppBar,
    Dialog,
    DialogTitle,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    DialogActions,
    Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import NewResultDialog from "./NewResultDialog";
import NewChallengeDialog from "./NewChallengeDialog";
import { BoardSelector } from "./BoardSelector";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDatabase, ref, remove } from "firebase/database";
import ArchivedChallengesDialog from "./ArchivedChallengesDialog";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const Layout = ({ children }) => {
    const [resultDialogOpen, setResultDialogOpen] = useState(false);
    const [challengeDialogOpen, setChallengeDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [accountEl, setAccountEl] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loggedIn = useSelector((state) => state.loggedIn);
    const isLoginScreen = useSelector((state) => state.isLoginScreen);
    const open = Boolean(anchorEl);
    const [accOpen, setAccOpen] = useState(false);
    const currentChallenge = useSelector((state) => state.currentChallenge);
    const db = getDatabase();
    const [archivedChallgedDialogOpen, setArchivedChallengeDialogOpen] =
        useState(false);
    const darkMode = useSelector((state) => state.darkMode)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const setAccountAnchorEl = (event) => {
        setAccountEl(event.currentTarget);
    };

    const handleAccountClose = () => {
        setAccountEl(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDialogClose = () => {
        setResultDialogOpen(false);
    };

    const handleChallengeDialogClose = () => {
        setChallengeDialogOpen(false);
    };

    const firebaseSignout = () => {
        const auth = getAuth();
        signOut(auth)
            .then(() => {
                dispatch({ type: "set/loggedInFalse" });
                localStorage.clear();
                window.location.reload(true);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    function deleteChallenge(e) {
        e.preventDefault();
        const challengeRef = ref(
            db,
            "Challenges/" + currentChallenge.replace(/ /g, "_") + "/"
        );
        remove(challengeRef);
        setDeleteDialogOpen(false);
    }

    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            dispatch({ type: "set/loggedInTrue" });
        } else {
            dispatch({ type: "set/loggedInFalse" });
        }
    }, [loggedIn]);

    return (
        <div>
            <AppBar position='static'>
                <Toolbar>
                    {loggedIn && (
                        <IconButton
                            size='large'
                            edge='start'
                            color='inherit'
                            aria-label='menu'
                            aria-controls={open ? "true" : undefined}
                            aria-expanded={open ? "true" : undefined}
                            sx={{ mr: 2 }}
                            onClick={(e) => handleClick(e)}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Menu
                        id='basic-menu'
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            "aria-labelledby": "basic-button",
                        }}
                    >
                        <MenuItem
                            onClick={() => {
                                setResultDialogOpen(true);
                                handleClose();
                            }}
                        >
                            Add new result
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setChallengeDialogOpen(true);
                                handleClose();
                            }}
                        >
                            Create a new challenge
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setDeleteDialogOpen(true);
                            }}
                        >
                            Delete current challenge
                        </MenuItem>
                    </Menu>
                    {!isLoginScreen && <BoardSelector></BoardSelector>}
                    {!isLoginScreen && (
                        <div style={{mr: 2, marginLeft: "auto"}}>
                        <IconButton onClick={() =>{
                            dispatch({type: "set/darkMode"})
                        }}>
                       {darkMode ? <LightModeIcon/> : <DarkModeIcon sx={{color: "white"}}/>}
                        </IconButton>
                        <IconButton
                            size='large'
                            edge='start'
                            color='inherit'
                            aria-label='menu'
                            sx={{ mr: 2, marginLeft: "auto" }}
                            onClick={(e) => {
                                setAccountAnchorEl(e);
                                setAccOpen(!accOpen);
                            }}
                        >
                            <AccountCircle></AccountCircle>

                            <Menu
                                id='basic-menu'
                                anchorEl={accountEl}
                                open={accOpen}
                                onClose={handleAccountClose}
                                MenuListProps={{
                                    "aria-labelledby": "basic-button",
                                }}
                            >
                                {!loggedIn && (
                                    <MenuItem
                                        onClick={() => {
                                            navigate("/login");
                                            handleAccountClose();
                                        }}
                                    >
                                        Log In
                                    </MenuItem>
                                )}
                                {loggedIn && (
                                    <div>
                                        <MenuItem
                                            onClick={() =>
                                                setArchivedChallengeDialogOpen(
                                                    true
                                                )
                                            }
                                        >
                                            View Archived Challenges
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                firebaseSignout();
                                                handleAccountClose();
                                            }}
                                        >
                                            Log out
                                        </MenuItem>
                                    </div>
                                )}
                            </Menu>
                        </IconButton>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
            <NewResultDialog
                open={resultDialogOpen}
                onClose={handleDialogClose}
            ></NewResultDialog>
            <NewChallengeDialog
                open={challengeDialogOpen}
                onClose={handleChallengeDialogClose}
            ></NewChallengeDialog>
            <Dialog open={deleteDialogOpen}>
                <DialogTitle>
                    Are you sure you want to delete {currentChallenge}?
                </DialogTitle>
                <DialogActions>
                    <Button
                        variant='contained'
                        color='error'
                        onClick={(e) => deleteChallenge(e)}
                    >
                        Delete
                    </Button>
                    <Button onClick={() => setDeleteDialogOpen(false)}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            <ArchivedChallengesDialog
                archivedChallgedDialogOpen={archivedChallgedDialogOpen}
                setArchivedChallengeDialogOpen={setArchivedChallengeDialogOpen}
            />
        </div>
    );
};

export default Layout;
