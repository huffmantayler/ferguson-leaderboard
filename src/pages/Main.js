import { Grid, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Leaderboard from "../Leaderboard";
import {
    getDatabase,
    ref,
    onValue,
    query,
    orderByChild,
    limitToLast,
} from "firebase/database";

const Main = () => {
    const [challenge, setChallenge] = useState();
    const selectedChallenge = useSelector((state) => state.selectedChallenge);
    const db = getDatabase();
    const dispatch = useDispatch();

    useEffect(() => {});

    useEffect(() => {
        getCurrentChallenges();
        if (selectedChallenge != null) {
            setChallenge(selectedChallenge);
        }
    }, [selectedChallenge]);
    //selected challenge not updating main correctly
    const getCurrentChallenges = (e) => {
        console.log(selectedChallenge);
        const challengeRef = query(
            ref(db, "Challenges/"),
            orderByChild("timeStamp"),
            limitToLast(1)
        );
        onValue(challengeRef, (snapshot) => {
            const challenge = snapshot.val();
            const challengeName = Object.keys(challenge)[0];
            setChallenge(challengeName.replace(/_/g, " "));
            dispatch({
                type: "setCurrentChallenge",
                payload: challengeName.replace(/_/g, " "),
            });
            dispatch({
                type: "setSelectedChallenge",
                payload: challengeName.replace(/_/g, " "),
            });
        });
    };

    return (
        <Grid container justifyContent={"center"} sx={{ paddingTop: "10px" }}>
            <Typography variant='h4'>{selectedChallenge}</Typography>

            <Grid
                sx={{ padding: "2rem" }}
                container
                spacing={4}
                justifyContent={"center"}
            >
                <Grid item lg={16}>
                    <Leaderboard
                        challenge={selectedChallenge}
                        type={"Male"}
                    ></Leaderboard>
                </Grid>
                <Grid item lg={16}>
                    <Leaderboard
                        challenge={selectedChallenge}
                        type={"Female"}
                    ></Leaderboard>
                </Grid>
                <Grid item lg={16}>
                    <Leaderboard
                        challenge={selectedChallenge}
                        type={"Co-ed"}
                    ></Leaderboard>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Main;
