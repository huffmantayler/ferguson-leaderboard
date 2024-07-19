import {
    Dialog,
    DialogTitle,
    Button,
    TextField,
    FormControlLabel,
    MenuItem,
    Select,
    DialogActions,
    Typography,
    DialogContent,
} from "@mui/material";
import { TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { useState } from "react";
import { getDatabase, ref, set, push, onValue } from "firebase/database";
import { useDispatch, useSelector } from "react-redux";

const NotesDialog = (props) => {
    const [challenge, setChallenge] = useState();
    const [type, setType] = useState();
    const [team, setTeam] = useState();
    const [score, setScore] = useState();
    const [invalid, setInvalid] = useState(false);
    const dispatch = useDispatch();
    const db = getDatabase();
    const challengeType = useSelector((state) => state.newResultChallengeType);

    function writeTeamResultData(e) {
        dispatch({
            type: "setSelectedChallenge",
            payload: challenge.replace(/_/g, " "),
        });
        e.preventDefault();
        let newScore = null;

        if (challengeType === "Time") {
            newScore = minutesToSeconds(score);
        } else {
            newScore = score;
        }
        const teamListRef = ref(
            db,
            "Challenges/" + challenge + "/" + type + "/"
        );
        const newTeamRef = push(teamListRef);
        set(newTeamRef, {
            team: team,
            score: Number(newScore),
            date: Date.now(),
        });
        props.onClose();
    }

    const handleScoreChange = (event) => {
        if (challengeType === "Time") {
            setScore(event);
        } else {
            setScore(event.target.value);
        }
    };

    const handleTeamChange = (event) => {
        setTeam(event.target.value);
    };

    const handleChallengeChange = (event) => {
        setChallenge(event.target.value.replace(/ /g, "_"));
    };

    const handleTypeChange = (event) => {
        setType(event.target.value);
    };

    const minutesToSeconds = (time) => {
        let minutes = time.get("minutes");
        let seconds = time.get("seconds");
        console.log(minutes * 60 + seconds);
        return Number(minutes) * 60 + Number(seconds);
    };

    const createChallengeItems = () => {
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
        });

        return challengeList.map((challenge) => {
            return (
                <MenuItem
                    key={challenge[0]}
                    data-type={challenge[1]}
                    value={challenge[0]}
                    onClick={(e) =>
                        dispatch({
                            type: "setNewResultChallengeType",
                            payload: e.target.dataset.type,
                        })
                    }
                >
                    {challenge[0]}
                </MenuItem>
            );
        });
    };

    const { open, onClose } = props;
    return (
        <Dialog open={open} PaperProps={{ sx: { width: "23rem" } }}>
            <DialogTitle>Notes</DialogTitle>
            <DialogContent>
                <Typography className='notes'>{props.value}</Typography>
            </DialogContent>

            <DialogActions>
                <Button
                    sx={{ margin: "10px" }}
                    onClick={onClose}
                    variant='contained'
                    color='error'
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default NotesDialog;
