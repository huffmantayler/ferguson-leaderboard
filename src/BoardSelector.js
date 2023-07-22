import { Select, MenuItem, IconButton, Menu } from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDatabase } from "firebase/database";
import { onValue, ref, onChildChanged } from "firebase/database";

export const BoardSelector = (props) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const challengeMap = useSelector((state) => state.challengeMap);
    const [challengeItems, setChallengeItems] = useState();
    const dispatch = useDispatch();
    const open = Boolean(anchorEl);
    const db = getDatabase();
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        getAllChallenges();
    }, []);

    useEffect(() => {
        generateChallengeItems();
    }, [challengeMap]);

    const getAllChallenges = (e) => {
        const challengeRef = ref(db, "Challenges/");
        let challengeList = [];
        onValue(challengeRef, (snapshot) => {
            const challenges = snapshot.val();
            for (const key in challenges) {
                challengeList.push([
                    key.replace(/_/g, " "),
                    challenges[key]["type"],
                ]);
            }
            dispatch({ type: "setChallengeMap", payload: challengeList });
        });
    };

    const updateSelectedChallenge = (e) => {
        dispatch({
            type: "setSelectedChallenge",
            payload: e.target.childNodes[0].data,
        });
    };

    const generateChallengeItems = () => {
        let names = [];
        challengeMap.forEach((name) => {
            names.push(
                <MenuItem
                    key={name[0]}
                    value={name[0]}
                    onClick={(e) => {
                        updateSelectedChallenge(e);
                        handleClose();
                    }}
                >
                    {name[0]}
                </MenuItem>
            );
        });
        setChallengeItems(names);
    };

    return (
        <div>
            <IconButton onClick={(e) => handleClick(e)}>
                <ListIcon style={{ color: "white" }}></ListIcon>
            </IconButton>
            <Menu
                id='basic-menu'
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    "aria-labelledby": "basic-button",
                }}
            >
                {challengeMap === null ? "" : challengeItems}
            </Menu>
        </div>
    );
};
