import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "room",
  initialState: null,
  reducers: {
    addRoom: (state, action) => {
      state.room = action.payload;
    },
    decrement: (state) => state - 1,
  },
});

export const { addRoom, decrement } = counterSlice.actions;
export default counterSlice.reducer;
