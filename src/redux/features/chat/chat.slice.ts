import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Message {
  _id: string;
  sender: string;
  receiver: string;
  text: string;
  createdAt: string;
}

export interface UserState {
  value: string;
  profile: {
    name: string;
    about: string;
    picture: { url: string };
    userId: string;
    _id: string;
  };
  messages: Message[];
  userProfile: {
    userId: string;
    name: string;
    about: string;
    picture: { url: string };
  };
  allChat: Array<{
    picture: {
      url: string;
    };
    name: string;
    about: string;
    userId: string;
    _id: string;
  }>;
  profileFetched: boolean;
}

const initialState: UserState = {
  value: "",
  profile: {
    name: "",
    about: "",
    picture: { url: "" },
    userId: "",
    _id: "",
  },
  messages: [],
  userProfile: {
    name: "",
    about: "",
    picture: { url: "" },
    userId: "",
  },
  allChat: [],
  profileFetched: false,
};

export const userSlice = createSlice({
  name: "userMessage",
  initialState,
  reducers: {
    userSetid: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
    storeProfile: (
      state,
      action: PayloadAction<{
        name: string;
        about: string;
        picture: { url: string };
        userId: string;
        _id: string;
      }>
    ) => {
      state.profile = action.payload;
      state.messages = [];
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    userProfile: (state, action: PayloadAction<any>) => {
      state.userProfile = action.payload;
      state.profileFetched = true;
    },
    setAllChat: (state, action: PayloadAction<any>) => {
      state.allChat = action.payload;
    },
    setProfileFetched: (state, action: PayloadAction<boolean>) => {
      state.profileFetched = action.payload;
    },
  },
});

export const {
  userSetid,
  storeProfile,
  setMessages,
  addMessage,
  userProfile,
  setAllChat,
} = userSlice.actions;
export default userSlice.reducer;
