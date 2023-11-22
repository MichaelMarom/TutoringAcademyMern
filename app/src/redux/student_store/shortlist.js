// slice.js
import { createSlice } from "@reduxjs/toolkit";
import { get_student_short_list } from "../../axios/student";

// Create a slice with your event-related reducers
const slice = createSlice({
    name: "shortlist",
    initialState: {
        shortlist: [],
        isLoading: false,
        error: null,
    },
    reducers: {
        isLoading: (state) => {
            state.isLoading = true;
        },
        getShortlist: (state, action) => {
            state.isLoading = false;
            state.shortlist = action.payload;
        },
        setShortlist: (state, action) => {
            state.isLoading = false;
            state.shortlist = action.payload
        }
    },
});

export default slice.reducer;

// ACTIONS

export function setShortlist() {
    return async (dispatch) => {
        dispatch(slice.actions.isLoading())
        const result = await get_student_short_list(window.localStorage.getItem('student_user_id'))
        console.log(result, 'shortlists')
        result.sort(function (a, b) {
            if (a.tutorShortList.Subject < b.tutorShortList.Subject) {
                return -1;
            }
            if (a.tutorShortList.Subject > b.tutorShortList.Subject) {
                return 1;
            }
            return 0;
        });

        dispatch(slice.actions.setShortlist(result));
        return result;
    };
}

