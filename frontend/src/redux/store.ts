import { configureStore } from '@reduxjs/toolkit';
import configSlice, { State as ConfigState } from './slices/config/config.slice';

export interface StoreState {
    config: ConfigState;
}

const store = configureStore({
    reducer: {
        config: configSlice,
    },
});

export default store;
export type AppDispatch = typeof store.dispatch;
