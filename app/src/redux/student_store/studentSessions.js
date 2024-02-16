// slice.js
import { createSlice } from "@reduxjs/toolkit";
import { formatted_student_sessions } from "../../axios/student";

// Create a slice with your event-related reducers
const slice = createSlice({
    name: "studentSessions",
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
        setStudentSession: (state, action) => {
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

export const setStudentSessions = (student) => {
    return async (dispatch) => {
        dispatch(slice.actions.isLoading())
        const result = await formatted_student_sessions(student.AcademyId)
        console.log(result)
        dispatch(slice.actions.setStudentSession(result));
        return result;
    };
}

