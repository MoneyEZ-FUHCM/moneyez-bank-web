import authApi from "@/services/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { UserInfo } from "@/types/user.types";

interface UserState {
  userInfo: UserInfo | null;
}

const initialState: UserState = {
  userInfo: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfo | null>) => {
      state.userInfo = action.payload;
    },
    clearUserInfo: (state) => {
      state.userInfo = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.getInfoUser.matchFulfilled,
      (state, action) => {
        state.userInfo = action.payload.data;
      },
    );
  },
});

export const selectUserInfo = (state: RootState) => state.user.userInfo;

export const { setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;
