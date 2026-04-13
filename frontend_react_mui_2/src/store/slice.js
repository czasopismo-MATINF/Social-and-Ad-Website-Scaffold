import { createSlice } from '@reduxjs/toolkit'

function copyConversations(conversations) {
  let newConversations = [...conversations];
  for(let i = 0; i < newConversations.length; ++i) {
    newConversations[i] = {
      ...conversations[i]
    }
    newConversations[i].messages = [...conversations[i].messages];
    for(let j = 0; j < conversations[i].messages.length; ++j) {
      newConversations[i].messages[j] = {...conversations[i].messages[j]}
    }
  }
  return newConversations;
}

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

      let oldConversations = copyConversations(state.conversations.conversations);
      let newConversations = action.payload.conversations;

      const mergeConversations = (oldConversations, newConversations) => {
        const map = new Map();
        for (const conv of oldConversations) {
          map.set(conv.id, conv);
        }
        for (const conv of newConversations) {
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
      
      let oldConversations = copyConversations(state.conversations.conversations);
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
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      const newConversations = [...map.values()].sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      state.conversations = {
        conversations: newConversations
      };

    },
    addFreshMessage: (state, action) => {
      
      const sMsg = action.payload;
      const conversations = copyConversations(state.conversations.conversations);
      let conversation = conversations.filter(c => c.id === sMsg.conversationId)[0];
      if(conversation === undefined) {
        const conver = {
          id : sMsg.conversationId,
          updatedAt : sMsg.createdAt,
          messages : [{...sMsg, updatedAt: sMsg.createdAt}]
        }
        conversations.push(conver);
        conversation = conver;
      } else {
        conversation.messages.push(sMsg);
      }
      conversation.messages.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      conversations.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      state.conversations = {
        conversations : conversations
      }
    }
    
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
  addFreshMessage,

} = slice.actions

export default slice.reducer
