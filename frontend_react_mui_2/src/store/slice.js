import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({

  name: 'main',
  
  initialState: {
    keycloakLoggedIn: false,
    userInfo : null,
    categoriesInfo: null,
    conversations: null,
  },

  reducers: {
    
    keycloakLoggedIn: (state) => { state.keycloakLoggedIn = true; },
    keycloakLoggedOut: (state) => { state.keycloakLoggedIn = false; state.userInfo = null; },
    userInfoCollected: (state, action) => {
      state.userInfo = {
        user: action.payload,
    }},
    categoriesInfoCollected: (state, action) => {
      state.categoriesInfo = {
        categories : action.payload,
    }},
    resetConversations: (state, action) => {
      state.conversations = action.payload;
    },
    addConversations: (state, action) => {
      
    },
    
  }
})

export const { 
  keycloakLoggedIn,
  keycloakLoggedOut,
  userInfoCollected,
  categoriesInfoCollected,
  resetConversations,
  addConversations,

} = slice.actions

export default slice.reducer
