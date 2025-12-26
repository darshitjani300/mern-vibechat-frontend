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
    picture: string;
    userId: string;
    _id: string;
  };
  messages: Message[];
  userProfile: {
    userId: string;
    picture: { url: string };
  };
}

const initialState: UserState = {
  value: "",
  profile: {
    name: "",
    about: "",
    picture: "",
    userId: "",
    _id: "",
  },
  messages: [],
  userProfile: {
    picture: { url: "" },
    userId: "",
  },
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
        picture: string;
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
    },
  },
});

export const { userSetid, storeProfile, setMessages, addMessage, userProfile } =
  userSlice.actions;
export default userSlice.reducer;
