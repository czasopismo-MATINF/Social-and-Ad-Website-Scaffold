import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'test slice',
  initialState: {
    counter: 0
  },
  reducers: {
    increment: (state) => { state.counter++ },
    decrement: (state) => { state.counter-- }
  }
})

export const { increment, decrement } = slice.actions
export default slice.reducer
