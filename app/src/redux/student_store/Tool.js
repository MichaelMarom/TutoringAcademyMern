import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  ToolValue: '5',
}

export const toolSlice = createSlice({
  name: 'tool',
  initialState,
  reducers: {
    
    setToolTo: (state, action) => {
      state.ToolValue = action.payload 
    },
  },
})

// Action creators are generated for each case reducer function
export const { setToolTo } = toolSlice.actions
export default toolSlice.reducer
