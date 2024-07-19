import {
    Dialog,
    DialogTitle,
    Button,
    TextField,
    FormControlLabel,
    MenuItem,
    Select,
    DialogActions,
} from "@mui/material";
import { TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { useState } from "react";
import { getDatabase, ref, set, push, onValue } from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import TextareaAutosize from "react-textarea-autosize";

const NewResultDialog = (props) => {
    const [challenge, setChallenge] = useState();
    const [type, setType] = useState();
    const [team, setTeam] = useState();
    const [score, setScore] = useState();
    const [notes, setNotes] = useState("");
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
            notes: notes,
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

    const handleNotesChange = (event) => {
        console.log(event.target.value)
        setNotes(event.target.value);
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
            <DialogTitle>Add new result</DialogTitle>
            <form onSubmit={(e) => writeTeamResultData(e)}>
                <FormControlLabel
                    className='label'
                    label='Challenge:'
                    labelPlacement='start'
                    style={{ paddingBottom: "10px" }}
                    control={
                        <Select
                            sx={{ minWidth: "170px", marginLeft: "25px" }}
                            onChange={(e) => handleChallengeChange(e)}
                        >
                            {createChallengeItems()}
                        </Select>
                    }
                />
                <FormControlLabel
                    label='Team Type: '
                    labelPlacement='start'
                    style={{ paddingBottom: "10px" }}
                    control={
                        <Select
                            sx={{ minWidth: "101px", marginLeft: "18px" }}
                            onChange={(e) => handleTypeChange(e)}
                        >
                            <MenuItem value={"Co-ed"}>Co-ed</MenuItem>
                            <MenuItem value={"Female"}>Female</MenuItem>
                            <MenuItem value={"Male"}>Male</MenuItem>
                        </Select>
                    }
                />
                <FormControlLabel
                    label='Team Name:'
                    labelPlacement='start'
                    style={{ paddingBottom: "10px" }}
                    onChange={(e) => handleTeamChange(e)}
                    control={
                        <TextField
                            size='small'
                            style={{ marginLeft: "10px" }}
                        ></TextField>
                    }
                />
                <FormControlLabel
                    label='Score:'
                    labelPlacement='start'
                    onChange={(e) => handleScoreChange(e)}
                    control={
                        challengeType === "Time" ? (
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                    sx={{
                                        marginLeft: "54px",
                                    }}
                                    onChange={(e) => handleScoreChange(e)}
                                    views={["minutes", "seconds"]}
                                    format='mm:ss'
                                />
                            </LocalizationProvider>
                        ) : (
                            <TextField
                                size='small'
                                type='number'
                                style={{ marginLeft: "54px" }}
                            ></TextField>
                        )
                    }
                />
                <FormControlLabel
                    label='Notes: '
                    labelPlacement='start'
                    //onChange={(e) => handleNotesChange(e)}
                    control={
                        <TextareaAutosize
                            style={{
                                fontFamily: "sans-serif",
                                marginLeft: "3.5rem",
                                marginTop: "10px",
                                minRows: 10,
                                height: "100px",
                                maxWidth: "175px",
                            }}
                            maxRows={10}
                            onChange={(e) => handleNotesChange(e)}
                        />
                    }
                ></FormControlLabel>
                <DialogActions>
                    <Button
                        sx={{ margin: "10px" }}
                        onClick={onClose}
                        variant='contained'
                        color='error'
                    >
                        Cancel
                    </Button>
                    <Button
                        sx={{ margin: "10px" }}
                        type='submit'
                        variant='contained'
                    >
                        Submit
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
export default NewResultDialog;
