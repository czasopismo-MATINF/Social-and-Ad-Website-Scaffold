import { configureStore } from '@reduxjs/toolkit'
import reducer from './slice.js'

export const store = configureStore({
  reducer: {
    example: reducer
  }
})
