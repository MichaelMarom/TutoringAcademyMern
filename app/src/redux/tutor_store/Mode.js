import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  ModeValue: 'mouse',
}

export const modeSlice = createSlice({
  name: 'mode',
  initialState,
  reducers: {
    
    setModeTo: (state, action) => {
      state.ModeValue = action.payload 
    },
  },
})

// Action creators are generated for each case reducer function
export const { setModeTo } = modeSlice.actions
export default modeSlice.reducer
