import { createSlice } from "@reduxjs/toolkit";

// Initialize state from localStorage if available
const initialState = {
  userInfo: JSON.parse(localStorage.getItem("userInfo")) || null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload)); // persist to localStorage
    },
    clearUser: (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo"); // remove from localStorage on logout
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
