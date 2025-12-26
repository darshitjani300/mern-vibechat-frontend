import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface TInititalState {
  open: boolean;
}

const initialState: TInititalState = {
  open: false,
};

export const chatSlice = createSlice({
  name: "chatSlice",
  initialState: initialState,
  reducers: {
    openChatVal: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload;
    },
    closeChatVal: (state) => {
      state.open = !state.open;
    },
  },
});

export const { openChatVal, closeChatVal } = chatSlice.actions;
export default chatSlice.reducer;
