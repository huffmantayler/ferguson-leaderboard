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
import { useEffect } from "react";
import { TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextareaAutosize from "react-textarea-autosize";

import { useState } from "react";
import {
    getDatabase,
    ref,
    set,
    push,
    onValue,
    update,
} from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";

const EditResultDialog = (props) => {
    const [challenge, setChallenge] = useState();
    const [type, setType] = useState();
    const [team, setTeam] = useState();
    const [score, setScore] = useState();
    const [notes, setNotes] = useState("");
    const db = getDatabase();
    const challengeMap = useSelector((state) => state.challengeMap);
    const selectedChallenge = useSelector((state) => state.selectedChallenge);
    const currentChallenge = useSelector((state) => state.currentChallenge);
    const [challengeType, setChallengeType] = useState();
    const [teamId, setTeamId] = useState();
    const [date, setDate] = useState();
    const { open, onClose, editTeam, teamType } = props;

    useEffect(() => {
        console.log(editTeam);
        setTeam(editTeam[0]);
        setScore(editTeam[1]);
        setTeamId(editTeam[2]);
        setDate(editTeam[3]);
        setNotes(editTeam[4]);
        if (selectedChallenge != null) {
            setChallenge(selectedChallenge);
        } else if (currentChallenge != null) {
            setChallenge(currentChallenge);
        }
    }, []);

    useEffect(() => {
        let chalType = null;
        challengeMap.forEach((chal) => {
            if (chal[0] === challenge) {
                chalType = chal[1];
            }
        });
        if (chalType === null) {
            setChallengeType(challengeMap[selectedChallenge]);
        } else {
            setChallengeType(chalType);
        }
        if (chalType === "Time") {
            secondsToMinutes(score);
        }
    }, [challenge]);

    function updateTeamResults(e) {
        e.preventDefault();
        let newScore = null;

        if (challengeType === "Time") {
            newScore = minutesToSeconds(score);
        } else {
            newScore = score;
        }
        const teamListRef = ref(
            db,
            "Challenges/" +
                challenge.replace(/ /g, "_") +
                "/" +
                teamType +
                "/" +
                teamId +
                "/"
        );

        set(teamListRef, {
            team: team,
            score: Number(newScore),
            date,
            notes,
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

    const handleTypeChange = (event) => {
        setType(event.target.value);
    };

    const handleNotesChange = (event) => {
        console.log(event.target.value);
        setNotes(event.target.value);
    };

    const minutesToSeconds = (time) => {
        let minutes = time.get("minutes");
        let seconds = time.get("seconds");
        return Number(minutes) * 60 + Number(seconds);
    };

    const secondsToMinutes = (time) => {
        let minutes = Math.floor(time / 60);
        let seconds = time - minutes * 60;
        if (seconds < 10) {
            seconds = "0" + seconds;
        } else if (seconds === 0) {
            seconds = "00";
        }
        setScore(dayjs().minute(minutes).second(Number(seconds)));
    };

    return (
        <Dialog open={open} PaperProps={{ sx: { width: "23rem" } }}>
            <DialogTitle>Edit entry </DialogTitle>
            <form onSubmit={(e) => updateTeamResults(e)}>
                <FormControlLabel
                    label='Team Type: '
                    labelPlacement='start'
                    style={{ paddingBottom: "10px" }}
                    control={
                        <Select
                            sx={{ minWidth: "101px", marginLeft: "18px" }}
                            onChange={(e) => handleTypeChange(e)}
                            value={teamType}
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
                    value={team}
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
                                    timeSteps={{ minutes: 1, seconds: 1 }}
                                    value={score}
                                    format='mm:ss'
                                />
                            </LocalizationProvider>
                        ) : (
                            <TextField
                                size='small'
                                type='number'
                                style={{ marginLeft: "54px" }}
                                value={score}
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
                            value={notes}
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
export default EditResultDialog;
