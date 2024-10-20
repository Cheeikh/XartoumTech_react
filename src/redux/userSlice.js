import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  edit: false,
  friends: [],
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
    updateProfileModal(state, action) {
      state.edit = action.payload;
    },
    updateUser(state, action) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setFriends(state, action) {
      state.friends = action.payload;
    },
    updateUserCredits(state, action) {
      if (state.user && state.user.user) {
        state.user.user.dailyPostCredits = action.payload;
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
  },
});


export const { 
  login, 
  logout, 
  updateProfile, 
  updateUser, 
  updateProfileModal, 
  setFriends,
  updateUserCredits 
} = userSlice.actions;

export const canAddProducts = (state) => {
  const allowedRoles = ['styliste', 'tailleur', 'vendeur'];
  return state.user && state.user.role && allowedRoles.includes(state.user.role.toLowerCase());
};

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

export const UpdateUser = (user) => (dispatch) => {
  dispatch(updateUser(user));
};

export const UpdateProfileModal = (val) => (dispatch) => {
  dispatch(updateProfileModal(val));
};

export const UpdateFriends = (friends) => (dispatch) => {
  dispatch(setFriends(friends));
};

export const UpdateUserCredits = (credits) => (dispatch) => {
  dispatch(updateUserCredits(credits));
};
