import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "../store/user";
import groupReducer from "../store/group";
import planReducer from "../store/plan";
import meetingReducer from "../store/meeting";
import itemReducer from "../store/item";
import statusReducer from "../store/test";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: "root", // localStorage key
  storage, // localStorage
};

const rootReducer = combineReducers({
  user: userReducer,
  groups: groupReducer,
  plan: planReducer,
  meeting: meetingReducer,
  status: statusReducer,
  item: itemReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({ reducer: persistedReducer });
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
