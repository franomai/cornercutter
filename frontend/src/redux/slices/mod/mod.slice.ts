import { createSlice } from '@reduxjs/toolkit';
import { StoreState } from '../../store';

import ModConfig, { CurseSpawnType, ModInfo, Options, SpawnType } from '../../../types/Configuration';

export interface State {
    mods: ModConfig[];
    selectedMod: number;
    enabledMod: number;
}

export const initialState: State = {
    mods: [],
    selectedMod: -1,
    enabledMod: -1,
};

const modSlice = createSlice({
    name: 'mod',
    initialState,
    reducers: {
        setSelectedMod(state, action: { payload: number }) {
            if (action.payload >= 0 && action.payload < state.mods.length) {
                state.selectedMod = action.payload;
            }
        },
        setEnabledMod(state, action: { payload: number }) {
            if (action.payload >= -1 && action.payload < state.mods.length) {
                state.enabledMod = action.payload;
            } else {
                state.enabledMod = -1;
            }
        },
        addMod(state, action: { payload: Omit<ModConfig, 'id'> }) {
            state.mods.push({ ...action.payload, id: state.mods.length });
            if (state.selectedMod === -1) {
                state.selectedMod = 0;
            }
        },
        setModInfo(state, action: { payload: ModInfo }) {
            if (state.selectedMod !== -1) {
                state.mods[state.selectedMod].info = action.payload;
            }
        },
        setSpawns(state, action: { payload: SpawnType }) {
            if (state.selectedMod !== -1) {
                state.mods[state.selectedMod].general.spawns = action.payload;
            }
        },
        setCurseSpawns(state, action: { payload: CurseSpawnType }) {
            if (state.selectedMod !== -1) {
                state.mods[state.selectedMod].general.curseSpawns = action.payload;
            }
        },
        setOptions(state, action: { payload: Options }) {
            if (state.selectedMod !== -1) {
                state.mods[state.selectedMod].general.options = action.payload;
            }
        },
        setStartingSkills(state, action: { payload: number[] }) {
            if (state.selectedMod !== -1) {
                state.mods[state.selectedMod].general.startingSkills = action.payload;
            }
        },
    },
});

export const {
    setSelectedMod,
    setEnabledMod,
    addMod,
    setModInfo,
    setSpawns,
    setCurseSpawns,
    setOptions,
    setStartingSkills,
} = modSlice.actions;

export const getSelectedMod = (state: StoreState) =>
    state.mod.selectedMod === -1 ? null : state.mod.mods[state.mod.selectedMod];

export const getEnabledMod = (state: StoreState) =>
    state.mod.enabledMod === -1 ? null : state.mod.mods[state.mod.enabledMod];

export const getAllMods = (state: StoreState) => state.mod.mods;

export default modSlice.reducer;
