// slice.js
import { createSlice } from "@reduxjs/toolkit";
import { save_student_events } from "../../axios/student";

const slice = createSlice({
    name: "studentBookings",
    initialState: {
        reservedSlots: [],
        bookedSlots: [],
        studentId: '',
        tutorId: '',
        subjectId: '',
        studentBookings: {},
        isLoading: false,
        error: null,
    },
    reducers: {
        isLoading: (state) => {
            state.isLoading = true;
        },
        getReservedSlots: (state, action) => {
            state.isLoading = false
            state.reservedSlots = action.payload;
        },
        getBookedSlots: (state, action) => {
            state.isLoading = false
            state.bookedSlots = action.payload;
        },
        setReservedSlots: (state, action) => {
            state.isLoading = false
            state.reservedSlots = action.payload;
        },
        setBookedSlots: (state, action) => {
            state.isLoading = false
            state.bookedSlots = action.payload;
        }
    },
});

export default slice.reducer;

// ACTIONS

export function getStudentBookings(data) {
    return async (dispatch) => {
        dispatch(slice.actions.isLoading(true));
        console.log(data)
        const result = await save_student_events(data);
        dispatch(slice.actions.setReservedSlots(data.reservedSlots))
        dispatch(slice.actions.setBookedSlots(data.bookedSlots))
        return result;
    };
}


