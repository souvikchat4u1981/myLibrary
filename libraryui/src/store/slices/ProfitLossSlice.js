import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  value: 0,
};

const ProfitLossSlice = createSlice({
  // A name, used in action types
  name: "theme",
  // The initial state for the reducer
  initialState,
  // An object of "case reducers". Key names will be used to generate actions.
  reducers: {
    changeProfitLoss(state, action) {
      state.value = action.payload;
    },
  },
});

export const { changeProfitLoss } = ProfitLossSlice.actions;
export default ProfitLossSlice.reducer;
