import { configureStore } from '@reduxjs/toolkit';
import categoryReducer from './store/slices/categorySlice';
import voteReducer from './store/slices/voteSlice';

export const store = configureStore({
  reducer: {
    categories: categoryReducer,
    voting: voteReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
