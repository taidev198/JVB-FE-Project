import { logOut } from './slices/user';
import { persistor } from './store';

export const logOutMiddleware = () => {
  return next => {
    return action => {
      if (action.type === logOut.type) {
        persistor.purge();
      }
      return next(action);
    };
  };
};
