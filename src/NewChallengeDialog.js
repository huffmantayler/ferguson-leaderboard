import { MonochromePhotosOutlined } from "@mui/icons-material";
import {
    Dialog,
    DialogTitle,
    Button,
    Typography,
    TextField,
    Grid,
    FormControlLabel,
    MenuItem,
    Select,
    DialogContent,
    DialogActions,
} from "@mui/material";
import { useState, useEffect } from "react";
import { getDatabase, ref, set, push } from "firebase/database";
import { useDispatch } from "react-redux";

const NewChallengeDialog = (props) => {
    const [type, setType] = useState();
    const [challenge, setChallenge] = useState();
    const dispatch = useDispatch();

    function writeNewChallengeToDB(e) {
        e.preventDefault();
        const db = getDatabase();
        const newChallengeRef = ref(
            db,
            "Challenges/" + challenge.replace(/ /g, "_") + "/"
        );
        set(newChallengeRef, {
            type: type,
            timeStamp: Date.now(),
        });
        dispatch({ type: "add/challengeMap", payload: [challenge, type] });
        props.onClose();
    }

    const handleChallengeNameChange = (event) => {
        setChallenge(event.target.value);
    };

    const handleTypeChange = (event) => {
        setType(event.target.value);
    };

    const { open, onClose } = props;
    return (
        <Dialog open={open} PaperProps={{ sx: { width: "23rem" } }}>
            <DialogTitle>Create a new challenge</DialogTitle>
            <form onSubmit={(e) => writeNewChallengeToDB(e)}>
                <FormControlLabel
                    className='label'
                    label='Type:'
                    labelPlacement='start'
                    style={{ paddingBottom: "10px" }}
                    control={
                        <Select
                            sx={{ minWidth: "170px", marginLeft: "96px" }}
                            onChange={(e) => handleTypeChange(e)}
                        >
                            <MenuItem key={"Time"} value={"Time"}>
                                Time
                            </MenuItem>
                            <MenuItem key={"Points"} value={"Points"}>
                                Points
                            </MenuItem>
                        </Select>
                    }
                />
                <FormControlLabel
                    label='Challenge Name:'
                    labelPlacement='start'
                    style={{ paddingBottom: "10px" }}
                    onChange={(e) => handleChallengeNameChange(e)}
                    control={
                        <TextField
                            size='small'
                            style={{ marginLeft: "10px" }}
                        ></TextField>
                    }
                />
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
            {/* </Grid> */}
        </Dialog>
    );
};
export default NewChallengeDialog;
