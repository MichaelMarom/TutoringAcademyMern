import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  save: null
}

export const saveSlice = createSlice({
  name: 'save',
  initialState,
  reducers: {
    
    setSaveTo: (state, action) => {
      state.save = action.payload 
    },
  },
})

// Action creators are generated for each case reducer function
export const { setSaveTo } = saveSlice.actions
export default saveSlice.reducer
