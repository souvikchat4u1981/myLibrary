import { combineReducers, configureStore } from "@reduxjs/toolkit";
import ThemeReducer from "./slices/ThemeSlice";
import ProfitReducer from "./slices/ProfitLossSlice";

const reducer = combineReducers({
  theme: ThemeReducer,
  profit: ProfitReducer,
  //We can add more reducer here
});

export const store = configureStore({
  reducer,
  // reducer: {
  //   application: AppReducer,
  // },
});

export default store;
