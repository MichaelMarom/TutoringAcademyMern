// slice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchEvents, storeEventAPI } from "../../axios/tutor";

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
      const modifiedPayload = action.payload.map(obj => {
        const startTimeDate = new Date(obj.startTime);
        const endTimeDate = new Date(obj.endTime);
        endTimeDate.setDate(endTimeDate.getDate() - 1);
        endTimeDate.setHours(23, 59, 59, 999);
        startTimeDate.setHours(0, 0, 0, 0);
        return {
          start: (new Date(startTimeDate)),
          end: (new Date(endTimeDate)),
          title: obj.title,
          allDay: undefined,
        }
      });
      state.events = modifiedPayload;
    },
    setEvents: (state, action) => {

      state.isLoading = false;
      state.events = [...state.events, action.payload];
      console.log(state.events, 'addEVEtnstate')
    }

  },
});

export default slice.reducer;


// ACTIONS

export function addEvent(data) {
  console.log("event data", data);
  return async (dispatch) => {
    dispatch(slice.actions.isLoading());

    await storeEventAPI(data);
    const result = await fetchEvents();
    console.log(result, 'from DB');
    dispatch(slice.actions.getEvents(result));
    return result;
  };
}
export function getEvents() {
  return async (dispatch) => {
    dispatch(slice.actions.isLoading());

    const result = await fetchEvents();
    console.log(result, 'from DB');
    dispatch(slice.actions.getEvents(result));
    return result;
  };
}