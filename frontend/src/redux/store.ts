import { configureStore } from '@reduxjs/toolkit';
import modSlice, { State as ModState } from './slices/mod';
import skillsSlice, { State as SkillsState } from './slices/skills';

export interface StoreState {
    mod: ModState;
    skills: SkillsState;
}

const store = configureStore({
    reducer: {
        mod: modSlice,
        skills: skillsSlice,
    },
});

export default store;
export type AppDispatch = typeof store.dispatch;
