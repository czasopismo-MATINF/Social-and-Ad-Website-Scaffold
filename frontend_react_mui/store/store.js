import { configureStore } from '@reduxjs/toolkit'
import exampleReducer from '../features/example/ExampleSlice'

export const store = configureStore({
  reducer: {
    example: exampleReducer
  }
})
