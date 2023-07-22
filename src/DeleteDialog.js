import {
    Dialog,
    DialogTitle,
    Button,
    TextField,
    FormControlLabel,
    MenuItem,
    Select,
    DialogActions,
    DialogContent,
    Typography,
} from "@mui/material";
import { useEffect } from "react";
import { TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { useState } from "react";
import {
    getDatabase,
    ref,
    set,
    push,
    onValue,
    update,
    remove,
} from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";

const DeleteDialog = (props) => {
    const [challenge, setChallenge] = useState();
    const db = getDatabase();
    const challengeMap = useSelector((state) => state.challengeMap);
    const selectedChallenge = useSelector((state) => state.selectedChallenge);
    const currentChallenge = useSelector((state) => state.currentChallenge);
    const [challengeType, setChallengeType] = useState();
    const [teamId, setTeamId] = useState();
    const { open, onClose, deleteTeam, teamType } = props;

    useEffect(() => {
        setTeamId(deleteTeam[2]);
        if (selectedChallenge != null) {
            setChallenge(selectedChallenge);
        } else if (currentChallenge != null) {
            setChallenge(currentChallenge);
        }
    }, []);

    function deleteTeamResults(e) {
        e.preventDefault();

        console.log(teamId);

        const teamListRef = ref(
            db,
            "Challenges/" +
                challenge.replace(/ /g, "_") +
                "/" +
                teamType +
                "/" +
                teamId
        );
        console.log(teamListRef);
        remove(teamListRef);
        props.onClose();
    }

    return (
        <Dialog open={open} PaperProps={{ sx: { width: "23rem" } }}>
            <DialogTitle>Delete Entry </DialogTitle>
            <form onSubmit={(e) => deleteTeamResults(e)}>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this entry?
                    </Typography>
                </DialogContent>
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
                        Delete
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
export default DeleteDialog;
