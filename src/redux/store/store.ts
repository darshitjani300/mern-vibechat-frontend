import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../features/chat/chat.slice";
import chatSlice from "../features/open/openChat.slice";

export const store = configureStore({
  reducer: {
    userSlice,
    chatSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
