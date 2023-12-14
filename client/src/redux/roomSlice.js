import { createSlice } from "@reduxjs/toolkit";

const roomSlice = createSlice({
  name: "room",
  initialState: {
    value: null,
  },
  reducers: {
    addRoom: (state, action) => {
      state.value = action.payload;
    },
    removeRoom: (state) => (state.value = null),
  },
});

export const { addRoom, removeRoom } = roomSlice.actions;

export const roomSelector = (state) => state.room.value;
export default roomSlice.reducer;
