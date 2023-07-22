import {
    Paper,
    Table,
    TableCell,
    TableRow,
    TableContainer,
    TableHead,
    IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect } from "react";
import {
    getDatabase,
    ref,
    set,
    onValue,
    query,
    orderByChild,
} from "firebase/database";
import { useSelector } from "react-redux";
import EditResultDialog from "./EditResultDialog";
import dayjs from "dayjs";
import DeleteDialog from "./DeleteDialog";

const Leaderboard = (props) => {
    const [maleData, setMaleData] = useState("");
    const [femaleData, setFemaleData] = useState("");
    const [coedData, setCoedData] = useState("");
    const [challenge, setChallenge] = useState();
    const [editResultsDialogOpen, setEditResultsDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editTeam, setEditTeam] = useState(null);
    const selectedChallenge = useSelector((state) => state.selectedChallenge);
    const currentChallenge = useSelector((state) => state.currentChallenge);
    //const challengeType = useSelector((state) => state.challengeType);
    const challengeMap = useSelector((state) => state.challengeMap);
    const loggedIn = useSelector((state) => state.loggedIn);

    const db = getDatabase();

    useEffect(() => {
        if (selectedChallenge != null) {
            setChallenge(selectedChallenge);
        } else if (currentChallenge != null) {
            setChallenge(currentChallenge);
        }
    }, [selectedChallenge, currentChallenge]);

    useEffect(() => {
        if (challenge != null) {
            const maleCountRef = ref(
                db,
                "Challenges/" + challenge.replace(/ /g, "_") + "/Male/"
            );
            const femaleCountRef = ref(
                db,
                "Challenges/" + challenge.replace(/ /g, "_") + "/Female/"
            );
            const coEdCountRef = ref(
                db,
                "Challenges/" + challenge.replace(/ /g, "_") + "/Co-ed/"
            );
            const maleQuery = query(maleCountRef, orderByChild("score"));
            const femaleQuery = query(femaleCountRef, orderByChild("score"));
            const coEdQuery = query(coEdCountRef, orderByChild("score"));

            onValue(maleQuery, (snapshot) => {
                const data = snapshot.val();
                createTableRows(data, "Male");
            });
            onValue(femaleQuery, (snapshot) => {
                const data = snapshot.val();
                createTableRows(data, "Female");
            });
            onValue(coEdQuery, (snapshot) => {
                const data = snapshot.val();
                createTableRows(data, "Coed");
            });
        }
    }, [challenge]);

    const secondsToMinutes = (time) => {
        let minutes = Math.floor(time / 60);
        let seconds = time - minutes * 60;
        if (seconds < 10) {
            seconds = "0" + seconds;
        } else if (seconds === 0) {
            seconds = "00";
        }
        return minutes + ":" + seconds;
    };

    const sortTeamsByScore = (teams) => {
        const teamsArr = [];
        for (const key in teams) {
            teamsArr.push([
                teams[key].team,
                Number(teams[key].score),
                key,
                teams[key].date === undefined ? null : teams[key].date,
            ]);
        }
        const sortedTeams = teamsArr.sort((a, b) => {
            return b[1] - a[1];
        });
        return sortedTeams;
    };

    const sortTeamsByTime = (teams) => {
        const teamsArr = [];
        for (const key in teams) {
            console.log(teams[key].team, teams[key].date);
            teamsArr.push([
                teams[key].team,
                Number(teams[key].score),
                key,
                teams[key].date === undefined ? null : teams[key].date,
            ]);
        }
        const sortedTeams = teamsArr.sort((a, b) => {
            return a[1] - b[1];
        });
        return sortedTeams;
    };

    const createDate = (epoch) => {
        let date = dayjs(epoch);
        return date.format("MM/DD/YY");
    };

    function createTableRows(teams, type) {
        let tableRows = [];
        let i = 1;
        let sortedTeams = null;
        let challengeType = null;
        challengeMap.forEach((chal) => {
            if (chal[0] === challenge) {
                challengeType = chal[1];
            }
        });
        if (challengeType === null) {
            challengeType = challengeMap[currentChallenge];
        }

        if (challengeType === "Time") {
            sortedTeams = sortTeamsByTime(teams);
        } else {
            sortedTeams = sortTeamsByScore(teams);
        }
        sortedTeams.forEach((team) => {
            tableRows.push(
                <TableRow>
                    <TableCell width={"20%"}>{i}</TableCell>
                    <TableCell>{team[0]}</TableCell>
                    <TableCell width={"10%"}>
                        {challengeType === "Time"
                            ? secondsToMinutes(team[1])
                            : team[1]}
                    </TableCell>
                    <TableCell>
                        {team[3] === null ? "" : createDate(team[3])}
                    </TableCell>
                    {loggedIn && (
                        <TableCell width={"5%"}>
                            <IconButton
                                onClick={() => {
                                    setEditTeam(team);
                                    setEditResultsDialogOpen(true);
                                }}
                            >
                                <EditIcon fontSize='small'></EditIcon>
                            </IconButton>
                            <IconButton
                                onClick={() => {
                                    setEditTeam(team);
                                    setDeleteDialogOpen(true);
                                }}
                            >
                                <DeleteIcon fontSize='small'></DeleteIcon>
                            </IconButton>
                        </TableCell>
                    )}
                </TableRow>
            );
            i++;
        });
        switch (type) {
            case "Male":
                setMaleData(tableRows);
                break;
            case "Female":
                setFemaleData(tableRows);
                break;
            case "Coed":
                setCoedData(tableRows);
        }
    }

    const handleClose = () => {
        setEditResultsDialogOpen(false);
    };

    const handleDeleteClose = () => {
        setDeleteDialogOpen(false);
    };

    return (
        <div>
            <TableContainer component={Paper} sx={{ marginBottom: "10px" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{props.type}</TableCell>
                            <TableCell>Team</TableCell>
                            {/* <TableCell>Category Rank</TableCell> */}
                            <TableCell>Score</TableCell>
                            <TableCell>Date</TableCell>
                            {loggedIn && <TableCell></TableCell>}
                        </TableRow>
                    </TableHead>
                    {props.type === "Male" && maleData}
                    {props.type === "Female" && femaleData}
                    {props.type === "Co-ed" && coedData}
                </Table>
            </TableContainer>
            {editResultsDialogOpen && (
                <EditResultDialog
                    open={editResultsDialogOpen}
                    editTeam={editTeam}
                    teamType={props.type}
                    onClose={handleClose}
                />
            )}
            {deleteDialogOpen && (
                <DeleteDialog
                    open={deleteDialogOpen}
                    deleteTeam={editTeam}
                    teamType={props.type}
                    onClose={handleDeleteClose}
                ></DeleteDialog>
            )}
        </div>
    );
};

export default Leaderboard;
