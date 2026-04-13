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
    addConversationWithMessages: (state, action) => {
      let oldConversations = state.conversations.conversations;
      let newConversation = action.payload;
      const map = new Map();
      for (const conv of oldConversations) {
        map.set(conv.id, conv);
      }
      if(map.get(newConversation.id) === undefined) {
        map.set(newConversation.id, newConversation);
      } else {
        map.get(newConversation.id).messages.push(...newConversation.messages);
        let mmsgs = map.get(newConversation.id).messages;
        const mmap = new Map();
        for(const msg of mmsgs) {
          mmap.set(msg.id, msg);
        }
        mmsgs = [...mmap.values()];
        map.get(newConversation.id).messages = mmsgs;
      }
      map.get(newConversation.id).messages.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      const newConversations = [...map.values()].sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      state.conversations = {
        conversations: newConversations
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
  addConversationWithMessages,
} = slice.actions

export default slice.reducer
