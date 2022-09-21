import { configureStore } from '@reduxjs/toolkit';
import modSlice, { State as ModState } from './slices/mod';
import skillsSlice, { State as SkillsState } from './slices/skills';
import cornercutterSlice, { State as CornerCutterState } from './slices/cornercutter';

export interface StoreState {
    mod: ModState;
    skills: SkillsState;
    cornercutter: CornerCutterState;
}

const store = configureStore({
    reducer: {
        mod: modSlice,
        skills: skillsSlice,
        cornercutter: cornercutterSlice,
    },
});

export default store;
export type AppDispatch = typeof store.dispatch;
