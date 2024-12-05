import { createSlice } from '@reduxjs/toolkit';

export interface UserState {
  accessToken: string | null;
  user: any;
  roleAccount: string | null;
}

/**
 * Default state object with initial values.
 */
const initialState: Readonly<UserState> = { accessToken: null, user: null, roleAccount: null };

/**
 * Create a slice as a reducer containing actions.
 *
 * In this example actions are included in the slice. It is fine and can be
 * changed based on your needs.
 */
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.roleAccount = action.payload.roleAccount;
    },
    logOut: () => {
      return initialState;
    },
  },
});

// A small helper of user state for `useSelector` function.
export const getUserState = (state: { user: UserState }) => state.user;

// Exports all actions
export const { login, logOut } = userSlice.actions;

export default userSlice.reducer;
