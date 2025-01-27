import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://9d62c32ff3ec.ngrok.app/ask-question";

export const fetchAudioResponse = createAsyncThunk(
  "audio/fetchAudioResponse",
  async ({ question }, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, { question });

      // Check for the expected response structure
      if (response.data && response.data.answer) {
        console.log("Fetched audio response:", response.data.answer);
        return response.data.answer;
      } else {
        return rejectWithValue("Invalid response format");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Audio slice definition
const audioSlice = createSlice({
  name: "audio",
  initialState: {
    answer: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Reducer to reset the audio state
    clearAudioState: (state) => {
      state.answer = null;
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
        state.answer = action.payload;
        console.log("Fetched audio response:", action.payload);
      })
      .addCase(fetchAudioResponse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch audio response";
      });
  },
});

export const { clearAudioState } = audioSlice.actions;
export default audioSlice.reducer;
