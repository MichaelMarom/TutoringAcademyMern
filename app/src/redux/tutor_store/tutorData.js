import { createSlice } from "@reduxjs/toolkit";
import { get_user_detail } from "../../axios/auth";
import * as tutorApis from "../../axios/tutor"

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
        dispatch(slice.actions.isLoading());
        let result;
        if (localStorage.getItem('tutor_user_id') === "undefined") {
            const user = JSON.parse(localStorage.getItem('user'))
            result = await tutorApis.get_tutor_setup_by_userId(user[0].SID)
        }
        else {
            result = await tutorApis.get_tutor_setup_by_acaId(localStorage.getItem('tutor_user_id'))
        }

        if (result[0]?.userId) {
            const selectedUserId = await get_user_detail(result[0]?.userId);
            dispatch(slice.actions.setTutor({ ...result[0], email: selectedUserId.email }));
            localStorage.setItem('tutor_screen_name', result[0].TutorScreenname)
            return data;
        }
        else{
            dispatch(slice.actions.setTutor({}));
        }
        return null;
    };
}