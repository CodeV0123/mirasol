import { configureStore } from "@reduxjs/toolkit";
import threeReducer from "./three";
import audioReducer from "./audio";

export const store = configureStore({
  reducer: {
    three: threeReducer,
    audio: audioReducer,
  },
});
