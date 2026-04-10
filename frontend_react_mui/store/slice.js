import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({

  name: 'test slice',
  
  initialState: {
    counter: 0,
    keycloakLoggedIn: false,
    userInfo : null,
    categories: null,
    testMessages: [],
    conversations: [],
  },

  reducers: {
    
    increment: (state) => { state.counter++ },
    decrement: (state) => { state.counter-- },
    keycloakLoggedIn: (state) => { state.keycloakLoggedIn = true },
    keycloakLoggedOut: (state) => { state.keycloakLoggedIn = false },
    userInfoCollected: (state, action) => { state.userInfo = action.payload },
    
    categoriesLoaded: (state, action) => {
      state.categories = {
        categories : action.payload,
    }},

    addTestMessage: (state, action) => {
      state.testMessages = [...state.testMessages, action.payload];
    },

    processMessage: (state, action) => {
      
      const { conversationId } = action.payload;

      const map = Object.fromEntries(
        state.conversations.map(c => [c.id, c])
      );

      if (!map[conversationId]) {
        map[conversationId] = { id: conversationId, messages: [] };
      }

      const messages = [...map[conversationId].messages];

      const exists = messages.some(m => m.id === action.payload.id);

      if (!exists) {
        messages.push(action.payload);
        messages.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      }

      map[conversationId] = {
        ...map[conversationId],
        messages
      };

      console.log(Object.values(map));
      state.conversations = Object.values(map);
    }


  }
})

export const { increment, decrement, keycloakLoggedIn, keycloakLoggedOut, userInfoCollected, userAdsCollected, categoriesLoaded,
  addTestMessage, processMessage
} = slice.actions
export default slice.reducer
