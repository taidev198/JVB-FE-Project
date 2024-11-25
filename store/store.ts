import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import globalReducer from './slices/global';
import userReducer from './slices/user';

const PERSIST_CONFIG = {
  root: {
    key: 'root',
    storage,
  },
};

const rootReducer = combineReducers({
  user: userReducer,
  global: globalReducer,
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
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
