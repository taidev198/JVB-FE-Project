import { useDispatch, useSelector } from 'react-redux';
import { RootState, store } from './store';

type AppDispatch = typeof store.dispatch;

// Since we use typescript, lets utilize `useDispatch`
export const useAppDispatch = () => useDispatch<AppDispatch>();

// And utilize `useSelector`
export const useAppSelector = <TSelected = unknown>(selector: (state: RootState) => TSelected): TSelected => useSelector<RootState, TSelected>(selector);
