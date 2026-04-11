import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({

  name: 'main',
  
  initialState: {
    keycloakLoggedIn: false,
    userInfo : null,
    categoriesInfo: null,
    conversations: { conversations: [] },
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

      let oldConversations = state.conversations.conversations;
      let newConversations = action.payload.conversations;

      const mergeConversations = (oldConversations, newConversations) => {
        const map = new Map();
        for (const conv of newConversations) {
          map.set(conv.id, conv);
        }
        for (const conv of oldConversations) {
          map.set(conv.id, conv);
        }
        return [...map.values()].sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
      };
      
      state.conversations = {
        conversations: mergeConversations(oldConversations, newConversations)
      };

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
