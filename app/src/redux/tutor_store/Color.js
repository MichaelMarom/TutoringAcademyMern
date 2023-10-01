import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    colorLine: '#000',
  }
  
  export const colorLineSlice = createSlice({
    name: 'color',
    initialState,
    reducers: {
      
      setColorTo: (state, action) => {
        state.colorLine = action.payload
      },
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { setColorTo } = colorLineSlice.actions
  
  export default colorLineSlice.reducer

  
  