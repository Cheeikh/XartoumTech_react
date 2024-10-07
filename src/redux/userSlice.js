import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  edit: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout(state) {
      state.user = null;
      localStorage.removeItem("user");
    },
    updateProfile(state, action) {
      state.edit = action.payload;
    },
  },
});

export const { login, logout, updateProfile } = userSlice.actions;
export default userSlice.reducer;

// Actions Thunk
export const UserLogin = (user) => (dispatch) => {
  dispatch(login(user));
};

export const Logout = () => (dispatch) => {
  dispatch(logout());
};

export const UpdateProfile = (val) => (dispatch) => {
  dispatch(updateProfile(val));
};
