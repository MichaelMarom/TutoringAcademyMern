import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    BoardAccess: 'tutor',
  }
  
  export const BoardAccessSlice = createSlice({
    name: 'BoardUser',
    initialState,
    reducers: {
      
      setBoardAccessTo: (state, action) => {
        state.BoardAccess = action.payload
      },
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { setBoardAccessTo } = BoardAccessSlice.actions
  
  export default BoardAccessSlice.reducer

  
  