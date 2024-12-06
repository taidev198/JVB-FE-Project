import { createSlice } from '@reduxjs/toolkit';
import { IAdmin, ICompany, IEmploymentCompany, IEmploymentSchool, ISchool } from '@/types/usersTypes';

type UserRoles = ICompany | ISchool | IAdmin | IEmploymentSchool | IEmploymentCompany;

export interface UserState {
  token: string | null;
  user: UserRoles | null;
  roleAccount: string | null;
}

/**
 * Default state object with initial values.
 */
const initialState: Readonly<UserState> = { token: null, user: null, roleAccount: null };

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
export const { logIn, logOut } = userSlice.actions;

export default userSlice.reducer;
