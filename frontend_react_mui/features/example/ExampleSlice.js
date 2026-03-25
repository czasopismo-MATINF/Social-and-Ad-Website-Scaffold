import { createSlice } from '@reduxjs/toolkit'

const exampleSlice = createSlice({
  name: 'example',
  initialState: {
    counter: 0
  },
  reducers: {
    increment: (state) => { state.counter++ },
    decrement: (state) => { state.counter-- }
  }
})

export const { increment, decrement } = exampleSlice.actions
export default exampleSlice.reducer
