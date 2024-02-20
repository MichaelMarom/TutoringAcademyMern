// slice.js
import { createSlice } from "@reduxjs/toolkit";
import { formatted_student_sessions } from "../../axios/student";
import { formatted_tutor_sessions } from "../../axios/tutor";

// Create a slice with your event-related reducers
const slice = createSlice({
    name: "tutorSessions",
    initialState: {
        sessions: [],
        upcomingSession: {},
        upcomingSessionFromNow: '',
        inMins: false
    },
    reducers: {
        isLoading: (state) => {
            state.isLoading = true;
        },
        setTutorSession: (state, action) => {
            state.isLoading = false;
            state.sessions = action.payload.sessions;
            state.upcomingSession = action.payload.upcomingSession;
            state.inMins = action.payload.inMins;

            state.upcomingSessionFromNow = action.payload.upcomingSessionFromNow;
        },
    },
});

export default slice.reducer;

// ACTIONS

export const setTutorSessions = (tutor) => {
    return async (dispatch) => {
        dispatch(slice.actions.isLoading())
        const result = await formatted_tutor_sessions(tutor.AcademyId)
        dispatch(slice.actions.setTutorSession(result));
        return result;
    };
}

