import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import globalReducer from './slices/global';
import toastReducer from './slices/toastSlice';
import userReducer from './slices/user';
import { adminSystemApi } from '@/services/adminSystemApi';
import { adminSchoolApi } from '@/services/adminSchoolApi';
import { adminCompanyApi } from '@/services/adminCompanyApi';

const PERSIST_CONFIG = {
  root: {
    key: 'root',
    storage,
  },
};

const rootReducer = combineReducers({
  user: userReducer,
  global: globalReducer,
  toast: toastReducer,
  [adminSystemApi.reducerPath]: adminSystemApi.reducer,
  [adminSchoolApi.reducerPath]: adminSchoolApi.reducer,
  [adminCompanyApi.reducerPath]: adminCompanyApi.reducer,
});

const persistedReducer = persistReducer(PERSIST_CONFIG.root, rootReducer);

/**
 * Creates a store and includes all the slices as reducers.
 */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(adminSystemApi.middleware, adminSchoolApi.middleware, adminCompanyApi.middleware),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
