import modSlice from './slices/mod';
import skillsSlice from './slices/skills';
import savingSlice from './slices/saving';
import cornercutterSlice from './slices/cornercutter';

import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
    reducer: {
        mod: modSlice,
        skills: skillsSlice,
        cornercutter: cornercutterSlice,
        saving: savingSlice,
    },
});

export default store;
export type AppDispatch = typeof store.dispatch;
export type StoreState = ReturnType<typeof store.getState>;
