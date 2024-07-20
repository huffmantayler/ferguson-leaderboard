import {
    DialogContent,
    DialogTitle,
    MenuItem,
    Dialog,
    DialogActions,
    Button,
} from "@mui/material";
import { onValue, getDatabase, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

function ArchivedChallengesDialog(props) {
    const db = getDatabase();
    const dispatch = useDispatch();
    const [challengeMap, setChallengeMap] = useState();
    const [challengeItems, setChallengeItems] = useState([]);

    useEffect(() => {
        getArchivedChallenges();
    }, []);

    useEffect(() => {
        if (challengeMap !== undefined) {
            generateChallengeItems();
        }
    }, [challengeMap]);

    const getArchivedChallenges = () => {
        const challengeRef = ref(db, "Challenges/");
        let challengeList = [];
        onValue(challengeRef, (snapshot) => {
            const challenges = snapshot.val();
            for (const key in challenges) {
                let date = new Date(challenges[key]["timeStamp"]);
                let now = new Date();
                let y1 = date.getFullYear();
                let y2 = now.getFullYear();
                let d1 = new Date(date).setFullYear(2000);
                let d2 = new Date(now).setFullYear(2000);
                let oneYearOrOlder = y2 - y1 > 1 || (y2 - y1 == 1 && d2 > d1);
                if (oneYearOrOlder) {
                    challengeList.push([
                        key.replace(/_/g, " "),
                        challenges[key]["type"],
                    ]);
                }
            }
        });
        setChallengeMap(challengeList);
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
                        props.setArchivedChallengeDialogOpen(false);
                    }}
                >
                    {name[0]}
                </MenuItem>
            );
        });
        if (names.length > 0) {
            setChallengeItems(names);
        }
    };

    const updateSelectedChallenge = (e) => {
        dispatch({
            type: "setSelectedChallenge",
            payload: e.target.childNodes[0].data,
        });
    };

    return (
        <Dialog open={props.archivedChallgedDialogOpen}>
            <DialogTitle>Archvied Challenges</DialogTitle>
            <DialogContent>
                {challengeItems.length === 0
                    ? "No archived challenges yet! Challenges will be archived after 1 year."
                    : challengeItems}
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => props.setArchivedChallengeDialogOpen(false)}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}
export default ArchivedChallengesDialog;
