import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'test slice',
  initialState: {
    counter: 0,
    keycloakLoggedIn: false,
    userInfo : null,
    categories: null,
  },
  reducers: {
    increment: (state) => { state.counter++ },
    decrement: (state) => { state.counter-- },
    keycloakLoggedIn: (state) => { state.keycloakLoggedIn = true },
    keycloakLoggedOut: (state) => { state.keycloakLoggedIn = false },
    userInfoCollected: (state, action) => { state.userInfo = action.payload },
    categoriesLoaded: (state, action) => { state.categories = {
      "categories" : action.payload,
      "getName" : function(id) {
         return this.categories.categories.find(item => item.id === id)?.description;
      }
    }},
  }
})

export const { increment, decrement, keycloakLoggedIn, keycloakLoggedOut, userInfoCollected, userAdsCollected, categoriesLoaded } = slice.actions
export default slice.reducer
