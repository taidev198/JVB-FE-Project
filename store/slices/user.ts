import { createSlice } from '@reduxjs/toolkit';
// type UserRoles = {
//   data: {
//     token: string;
//     name: string;
//     idAccount: number;
//     roleAccount: string;
//   };
// };

export interface UserState {
  token: string | null;
  name: string | null;
  id: number | null;
  idAccount: number | null;
  logoUrl: string | null;
  roleAccount: string | null;
}

/**
 * Default state object with initial values.
 */
const initialState: Readonly<UserState> = { token: null, name: null, id: null, idAccount: null, logoUrl: null, roleAccount: null };

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
    logIn: (state, action) => {
      state.token = action.payload.token;
      state.name = action.payload.name;
      state.id = action.payload.id;
      state.idAccount = action.payload.idAccount;
      state.logoUrl = action.payload.logoUrl;
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
export const { logIn, logOut } = userSlice.actions;

export default userSlice.reducer;
