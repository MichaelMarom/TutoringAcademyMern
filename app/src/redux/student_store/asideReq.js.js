import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  asideReqValue: '',
}

export const asideReqSlice = createSlice({
  name: 'asideReq',
  initialState,
  reducers: {
    
    setAsideReqTo: (state, action) => {
      state.asideReqValue = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setAsideReqTo } = asideReqSlice.actions
export default asideReqSlice.reducer
