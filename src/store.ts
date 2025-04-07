// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import authReducer from './features/authSlice';
import likeReducer from './features/likeSlice';
import matchReducer from './features/matchSlice';
import exploreReducer from './features/exploreSlice'
import conversationsReducer from './features/conversationsSlice'
import nearByReducer from './features/nearBySlice'
import likeLimitationSlice from './features/likeLimitationSlice';
import NearByLimitationSlice from './features/NearByLikeLimitation'
import messageReducer from './features/messageSlice';
import statusReducer from './features/statusSlice';
import referralReducer from './features/refralSlice';
import activityReducer from './features/activitySlice';
import chatSlice from './features/chatSlice';

// Configure the store
export const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    like: likeReducer,
    match: matchReducer,
    explore: exploreReducer,
    conversation: conversationsReducer,
    nearBy: nearByReducer,
    likeLimit: likeLimitationSlice,
    NearByLimitation: NearByLimitationSlice,
    message: messageReducer,
    status: statusReducer,
    referral: referralReducer,
    activity: activityReducer,
    chat:chatSlice

  },
});

// Save the activity score to localStorage whenever it changes.
store.subscribe(() => {
  if (typeof localStorage !== "undefined") {
    const state = store.getState();
    localStorage.setItem("activityScore", state.activity.activityScore.toString());
  }
});


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
