import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  toolReqValue: '',
}

export const toolReqSlice = createSlice({
  name: 'toolReq',
  initialState,
  reducers: {
    
    setToolReqTo: (state, action) => {
      state.toolReqValue = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setToolReqTo } = toolReqSlice.actions
export default toolReqSlice.reducer
