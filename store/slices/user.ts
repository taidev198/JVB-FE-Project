import { createSlice } from '@reduxjs/toolkit';

export interface UserState {}

/**
 * Default state object with initial values.
 */
const initialState: Readonly<UserState> = {};

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
    reset: () => {
      return initialState;
    },
  },
});

// A small helper of user state for `useSelector` function.
export const getUserState = (state: { user: UserState }) => state.user;

// Exports all actions
export const { reset } = userSlice.actions;

export default userSlice.reducer;
