import { createSlice } from '@reduxjs/toolkit';
import { StoreState } from '../../store';

import ModConfig, { CurseSpawnType, ModInfo, Options, SpawnType } from '../../../types/Configuration';

export interface State {
    mods: ModConfig[];
    currentMod: number;
}

export const initialState: State = {
    mods: [],
    currentMod: -1,
};

const modSlice = createSlice({
    name: 'mod',
    initialState,
    reducers: {
        setCurrentMod(state, action: { payload: number }) {
            state.currentMod = state.mods[action.payload] ? action.payload : -1;
        },
        addMod(state, action: { payload: Omit<ModConfig, 'id'> }) {
            state.mods.push({ ...action.payload, id: state.mods.length });
        },
        setModInfo(state, action: { payload: ModInfo }) {
            if (state.currentMod !== -1) {
                state.mods[state.currentMod].info = action.payload;
            }
        },
        setSpawns(state, action: { payload: SpawnType }) {
            if (state.currentMod !== -1) {
                state.mods[state.currentMod].general.spawns = action.payload;
            }
        },
        setCurseSpawns(state, action: { payload: CurseSpawnType }) {
            if (state.currentMod !== -1) {
                state.mods[state.currentMod].general.curseSpawns = action.payload;
            }
        },
        setOptions(state, action: { payload: Options }) {
            if (state.currentMod !== -1) {
                state.mods[state.currentMod].general.options = action.payload;
            }
        },
        setStartingSkills(state, action: { payload: number[] }) {
            if (state.currentMod !== -1) {
                state.mods[state.currentMod].general.startingSkills = action.payload;
            }
        },
    },
});

export const { setModInfo, setSpawns, setCurseSpawns, setOptions, setStartingSkills } = modSlice.actions;

export const getCurrentMod = (state: StoreState) =>
    state.mod.currentMod === -1 ? null : state.mod.mods[state.mod.currentMod];

export const getMods = (state: StoreState) => state.mod.mods;

export default modSlice.reducer;
