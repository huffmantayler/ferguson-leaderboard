import { configureStore } from "@reduxjs/toolkit";

export const initialState = {
    currentChallenge: null,
    challengeType: null,
    newResultChallengeType: null,
    selectedChallenge: null,
    loggedIn: false,
    isLoginScreen: false,
    challengeMap: [],
    darkMode: true,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "setSelectedChallenge":
            return {
                ...state,
                selectedChallenge: action.payload,
            };
        case "setCurrentChallenge":
            return {
                ...state,
                currentChallenge: action.payload,
            };
        case "setChallengeType":
            return {
                ...state,
                challengeType: action.payload,
            };
        case "setNewResultChallengeType":
            return {
                ...state,
                newResultChallengeType: action.payload,
            };
        case "setChallengeMap":
            const existsInArray = state.challengeMap.some(
                (chal) => chal.name === action.payload.name
            );
            if (existsInArray) {
                return state;
            }
            return {
                ...state,
                challengeMap: [...state.challengeMap, ...action.payload],
            };
        case "add/challengeMap":
            return {
                ...state,
                challengeMap: [...state.challengeMap, action.payload],
            };
        case "set/loggedInTrue":
            return {
                ...state,
                loggedIn: true,
            };
        case "set/loggedInFalse":
            return {
                ...state,
                loggedIn: false,
            };
        case "set/isLoginScreen":
            return {
                ...state,
                isLoginScreen: action.payload,
            };
        case "set/darkMode":
            return {
                ...state,
                darkMode: !state.darkMode,
            }
    }
    return state;
};

const store = configureStore({ reducer: reducer });
export default store;
