import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://backend.scans.codes/scrap/binaryTobase64";

export const fetchAudioResponse = createAsyncThunk(
  "audio/fetchAudioResponse",
  async ({ id, text }, { rejectedWithValue }) => {
    try {
      const response = await axios.post(API_URL, { id, text });

      if (response.data && response.data.base64) {
        return response.data;
      } else {
        return rejectedWithValue("Invalid response format");
      }
    } catch (error) {
      return rejectedWithValue(error.message);
    }
  }
);

const audioSlice = createSlice({
  name: "audio",
  initialState: {
    base64: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAudioState: (state) => {
      state.base64 = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAudioResponse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAudioResponse.fulfilled, (state, action) => {
        state.loading = false;
        state.base64 = action.payload;
      })
      .addCase(fetchAudioResponse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAudioState } = audioSlice.actions;
export default audioSlice.reducer;
