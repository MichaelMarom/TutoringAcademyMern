import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  lineWidthValue: '5',
}

export const thicknessSlice = createSlice({
  name: 'lineWidth',
  initialState,
  reducers: {
    
    setLineWidthTo: (state, action) => {
      state.lineWidthValue = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setLineWidthTo } = thicknessSlice.actions
export default thicknessSlice.reducer
