// slice.js
import { createSlice } from "@reduxjs/toolkit";

// Create a slice with your event-related reducers
const slice = createSlice({
    name: "tutor",
    initialState: {
        tutor: {},
        isLoading: false,
        error: null,
    },
    reducers: {
        isLoading: (state) => {
            state.isLoading = true;
        },
        getTutor: (state, action) => {
            state.isLoading = false;
            state.tutor = action.payload;
        },
        setTutor: (state, action) => {
            state.isLoading = false;
            state.tutor = action.payload
        }
    },
});

export default slice.reducer;

// ACTIONS

export function setTutor(data) {
    return async (dispatch) => {
        dispatch(slice.actions.setTutor(data));
        return data;
    };
}

