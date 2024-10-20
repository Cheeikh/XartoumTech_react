import { combineReducers } from "@reduxjs/toolkit";

import userSlice from "./userSlice";
import themeSlice from "./theme";
import postSlice from "./postSlice";
import productSlice from "./productSlice";
import cartReducer from './cartSlice';

const rootReducer = combineReducers({
  user: userSlice,
  theme: themeSlice,
  posts: postSlice,
  product: productSlice,
  cart: cartReducer
});

export { rootReducer };
