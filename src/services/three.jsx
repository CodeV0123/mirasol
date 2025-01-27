import { createSlice } from "@reduxjs/toolkit";

const threeSlice = createSlice({
  name: "Drag",
  initialState: {
    loading: false,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setLoading } = threeSlice.actions;

export default threeSlice.reducer;
