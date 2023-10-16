import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  screenName: window.localStorage.getItem('tutor_screen_name'),
}

export const screenNameSlice = createSlice({
  name: 'screenName',
  initialState,
  reducers: {
    
    setscreenNameTo: (state, action) => {
      state.TutorScreenname = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setscreenNameTo } = screenNameSlice.actions
export default screenNameSlice.reducer
