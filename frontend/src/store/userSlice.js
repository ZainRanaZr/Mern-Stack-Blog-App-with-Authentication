import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  email: "",
  username: "",
  first_name: "",
  last_name: "",
  auth: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      const { _id, email, username, first_name, last_name, auth } =
        action.payload;

      state._id = _id;
      state.email = email;
      state.username = username;
      state.first_name = first_name;
      state.last_name = last_name;
      state.auth = auth;
    },
    resetUser: (state, action) => {
      state._id = "";
      state.email = "";
      state.username = "";
      state.first_name = "";
      state.last_name = "";
      state.auth = false;
    },
  },
});

export const { setUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
