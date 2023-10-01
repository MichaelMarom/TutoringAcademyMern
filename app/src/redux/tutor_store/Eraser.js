import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  eraserWidthValue: 1,
}

export const eraserSlice = createSlice({
  name: 'eraserWidth',
  initialState,
  reducers: {
    
    setEraserWidthTo: (state, action) => {
      state.eraserWidthValue = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setEraserWidthTo } = eraserSlice.actions
export default eraserSlice.reducer
