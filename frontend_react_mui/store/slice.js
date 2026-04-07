import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'test slice',
  initialState: {
    counter: 0,
    keycloakLoggedIn: false,
    userInfo : null,
    userAds: null,
  },
  reducers: {
    increment: (state) => { state.counter++ },
    decrement: (state) => { state.counter-- },
    keycloakLoggedIn: (state) => { state.keycloakLoggedIn = true },
    keycloakLoggedOut: (state) => { state.keycloakLoggedIn = false },
    userInfoCollected: (state, action) => { state.userInfo = action.payload },
    userAdsCollected: (state, action) => { state.userAds = action.payload },
  }
})

export const { increment, decrement, keycloakLoggedIn, keycloakLoggedOut, userInfoCollected, userAdsCollected } = slice.actions
export default slice.reducer
