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
    TextareaAutosize,
} from "@mui/material";

import { useEffect, useState } from "react";
import { getDatabase, ref, set, push } from "firebase/database";
import { useDispatch, useSelector } from "react-redux";

const NotesDialog = ({teamData, open, handleNotesClose}) => {
    // const [challenge, setChallenge] = useState();
    // const [type, setType] = useState();
    // const [team, setTeam] = useState();
    // const [score, setScore] = useState();
    const [newNotes, setNewNotes] = useState()
    const [editing, setEditing] = useState(false);
    const dispatch = useDispatch();
    const db = getDatabase();
    const selectedChallenge = useSelector((state) => state.selectedChallenge);

    useEffect(() => {
        if(teamData !== null){
        setNewNotes(teamData.currentNotes)
    }
    }, [teamData])

    function saveNewNote() {
        console.log("Save new note")
        console.log(selectedChallenge)
        
        console.log("Challenges/" + selectedChallenge.replace(/ /g, "_") + "/" + teamData.teamType + "/" + teamData.key + "/")
        // e.preventDefault();

        const teamRef = ref(
            db,
            "Challenges/" + selectedChallenge.replace(/ /g, "_") + "/" + teamData.teamType + "/" + teamData.key + "/"
        );
        set(teamRef, {
            team: teamData.team,
            score: teamData.score,
            date: teamData.date,
            notes: newNotes
        });
        // props.onClose();
    }

    // function writeTeamResultData(e) {
    //     dispatch({
    //         type: "setSelectedChallenge",
    //         payload: challenge.replace(/_/g, " "),
    //     });
        
    //     let newScore = null;

    //     if (challengeType === "Time") {
    //         newScore = minutesToSeconds(score);
    //     } else {
    //         newScore = score;
    //     }

    //     const teamListRef = ref(
    //         db,
    //         "Challenges/" + challenge + "/" + type + "/"
    //     );
    //     const newTeamRef = push(teamListRef);
    //     set(newTeamRef, {
    //         team: team,
    //         score: Number(newScore),
    //         date: Date.now(),
    //     });
    //     handleNotesClose();
    // }

    const minutesToSeconds = (time) => {
        let minutes = time.get("minutes");
        let seconds = time.get("seconds");
        console.log(minutes * 60 + seconds);
        return Number(minutes) * 60 + Number(seconds);
    };

    const handleEditClick = () => {
        if(editing) { //save is clicked
            saveNewNote();
        }
        setEditing(!editing);
    }

    return (
        <Dialog open={open} PaperProps={{ sx: { width: "23rem" } }}>
            <DialogTitle>Notes</DialogTitle>
            <DialogContent>
                {editing ? <TextareaAutosize onChange={(e) => setNewNotes(e.target.value)} minRows={5}>{newNotes}</TextareaAutosize> : <Typography className='notes'>{newNotes}</Typography>}
            </DialogContent>

            <DialogActions>
                <Button
                sx={{ margin: "10px" }}
                onClick={() => {
                    handleEditClick();
                }}
                variant='contained'
                >
                    {editing ? 'Save' : 'Edit'}
                </Button>
                <Button
                    sx={{ margin: "10px" }}
                    onClick={() => {
                        if(editing){
                            setEditing(false);
                            setNewNotes('')
                        } else {
                            handleNotesClose();
                        }
                        
                    }}
                    variant='contained'
                    color='error'
                >
                    {editing ? 'Cancel' : 'Close'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default NotesDialog;
