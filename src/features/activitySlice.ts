// activitySlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ActivityState {
  activityScore: number;
}

const getInitialActivityScore = (): number => {
  if (typeof localStorage !== "undefined") {
    const stored = localStorage.getItem("activityScore");
    return stored ? parseInt(stored, 10) : 0;
  }
  return 0;
};

const initialState: ActivityState = {
  activityScore: getInitialActivityScore(),
};

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    incrementActivity: (state, action: PayloadAction<number>) => {
      state.activityScore = Math.min(state.activityScore + action.payload, 100);
    },
    setActivity: (state, action: PayloadAction<number>) => {
      state.activityScore = Math.max(0, Math.min(action.payload, 100));
    },
    resetActivity: (state) => {
      state.activityScore = 0;
    },
  },
});

export const { incrementActivity, setActivity, resetActivity } = activitySlice.actions;
export default activitySlice.reducer;
