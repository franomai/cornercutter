import { configureStore } from '@reduxjs/toolkit';
import configSlice, { State as ConfigState } from './slices/config';
import skillsSlice, { State as SkillsState } from './slices/skills';

export interface StoreState {
    config: ConfigState;
    skills: SkillsState;
}

const store = configureStore({
    reducer: {
        config: configSlice,
        skills: skillsSlice,
    },
});

export default store;
export type AppDispatch = typeof store.dispatch;
