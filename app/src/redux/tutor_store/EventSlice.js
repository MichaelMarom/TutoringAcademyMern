// slice.js
import {  createSlice } from "@reduxjs/toolkit";
import { storeEventAPI } from "../../axios/tutor";

// Create a slice with your event-related reducers
const slice = createSlice({
  name: "events",
  initialState: {
    events: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    isLoading: (state) => {
      state.isLoading = true;
    },
    getEvents: (state, action) => {
      state.isLoading = false;
      state.events = action.payload;
    },
    setEvents:(state, action) => {
      state.isLoading = false;
      state.events = [...state.events,action.payload];
    }
    
  },
});

export default slice.reducer;


// ACTIONS

export function addEvent(data) {
  console.log("event data",data);
  return async (dispatch) => {
    dispatch(slice.actions.isLoading());

    const result = await storeEventAPI(data);
    dispatch(slice.actions.setEvents(result));

    return result;
  };
}