import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    canvasList: [],
  }
  
  export const canvasListSlice = createSlice({
    name: 'canvasList',
    initialState,
    reducers: {
      
      setCanvasListTo: (state, action) => {
        state.canvasList = action.payload
      },
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { setcanvasListTo } = canvasListSlice.actions
  
  export default canvasListSlice.reducer

  
  