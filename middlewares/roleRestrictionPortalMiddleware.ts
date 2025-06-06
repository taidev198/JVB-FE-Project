// middlewares/roleRestrictionMiddleware.ts
import { Middleware } from '@reduxjs/toolkit';

const roleRestrictionMiddleware: Middleware = store => next => action => {
  const state = store.getState();
  const { token, roleAccount } = state.user;

  if (typeof window !== 'undefined') {
    const restrictedPaths = {
      UNIVERSITY: ['/portal/workshop', '/portal/schools'],
      COMPANY: ['/portal/companies', '/portal/jobs'],
    };

    const currentPath = window.location.pathname;

    if (!state._persist?.rehydrated) {
      return next(action);
    }

    // Redirect to login if not logged in and accessing `/portal`
    if (!token && currentPath.startsWith('/portal')) {
      window.location.href = '/auth/login';
      return;
    }

    // If token is present and access to /auth/login or /auth/Register, redirect to home page
    if (token && (currentPath === '/auth/login' || currentPath === '/auth/Register')) {
      window.location.href = '/';
      return;
    }

    // Restrict access based on role
    if (roleAccount && restrictedPaths[roleAccount]?.some(restrictedPath => currentPath.startsWith(restrictedPath))) {
      window.location.href = '/'; // Redirect to a safe
      return;
    }
  }

  return next(action);
};

export default roleRestrictionMiddleware;
