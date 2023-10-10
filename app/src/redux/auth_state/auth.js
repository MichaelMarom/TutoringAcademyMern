// slice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchEvents, storeEventAPI } from "../../axios/tutor";

// Create a slice with your event-related reducers
const slice = createSlice({
    name: "user",
    initialState: {
        user: {
            sid: 1,
            firstName: "Naomi",
            middleName: "C",
            lastName: "Marom",
            email: "ddiffo@gmail.com",
            password: "qwertyui",
            cell: 15166088464,
            language: "English",
            ageGrade: "9th",
            grade: "",
            address1: "476 Shotwell Rd",
            address2: "Ste 102",
            city: "Clayton",
            state: "CA",
            zipCode: "27527",
            country: "USA",
            gmt: "+03",
            parentEmail: "ddiffo@gmail.com",
            parentFirstName: "Marom",
            parentLastName: "Naomi",
            academyId: "Naomi. C. M8bc074",
            screenName: "Naomi. C. M",
            photo: "data:image/png;ba...", // Replace with actual image data
            status: "Active"
        },
        isLoading: false,
        error: null,
    },
    reducers: {
        isLoading: (state) => {
            state.isLoading = true;
        },
        getLoggedinUser: (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
        },
        setLoggedinUser: (state, action) => {
            state.isLoading = false;
            state.user = {
                sid: 1,
                firstName: "Naomi",
                middleName: "C",
                lastName: "Marom",
                email: "ddiffo@gmail.com",
                password: "qwertyui",
                cell: 15166088464,
                language: "English",
                ageGrade: "9th",
                grade: "",
                address1: "476 Shotwell Rd",
                address2: "Ste 102",
                city: "Clayton",
                state: "CA",
                zipCode: "27527",
                country: "USA",
                gmt: "+03",
                parentEmail: "ddiffo@gmail.com",
                parentFirstName: "Marom",
                parentLastName: "Naomi",
                academyId: "Naomi. C. M8bc074",
                screenName: "Naomi. C. M",
                photo: "data:image/png;ba...", // Replace with actual image data
                status: "Active"
            }
        }

    },
});

export default slice.reducer;

// ACTIONS

export function setUser(data) {
    return async (dispatch) => {
        dispatch(slice.actions.setSubject(data));
        return data;
    };
}

