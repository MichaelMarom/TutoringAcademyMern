import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  paintValue: '#000',
}

export const paintSlice = createSlice({
  name: 'paint',
  initialState,
  reducers: {
    
    setPaintTo: (state, action) => {
      state.paintValue = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setPaintTo } = paintSlice.actions
export default paintSlice.reducer
