import { createSlice } from '@reduxjs/toolkit';
import ModConfig, { CurseSpawnType, ModInfo, Options, SpawnType } from '../../../types/Configuration';
import { StoreState } from '../../store';

export interface State {
    mod: ModConfig;
}

export const initialState: State = {
    mod: {
        info: {
            name: 'New Mod',
            description: 'You can change the name and description of this mod by clicking on the edit button',
        },
        general: {
            spawns: SpawnType.Looped,
            curseSpawns: CurseSpawnType.Randomly,
            options: Options.RemoveHealingItems | Options.DisablePinned,
            startingSkills: [],
        },
    },
};

const configSlice = createSlice({
    name: `config`,
    initialState,
    reducers: {
        setModInfo(state, action: { payload: ModInfo }) {
            state.mod.info = action.payload;
        },
        setSpawns(state, action: { payload: SpawnType }) {
            state.mod.general.spawns = action.payload;
        },
        setCurseSpawns(state, action: { payload: CurseSpawnType }) {
            state.mod.general.curseSpawns = action.payload;
        },
        setOptions(state, action: { payload: Options }) {
            state.mod.general.options = action.payload;
        },
        setStartingSkills(state, action: { payload: number[] }) {
            state.mod.general.startingSkills = action.payload;
        },
    },
});

export const { setModInfo, setSpawns, setCurseSpawns, setOptions, setStartingSkills } = configSlice.actions;

export const getMod = (state: StoreState) => state.config.mod;

export const getModInfo = (state: StoreState) => state.config.mod.info;

export const getSpawns = (state: StoreState) => state.config.mod.general.spawns;

export const getCurseSpawns = (state: StoreState) => state.config.mod.general.curseSpawns;

export const getOptions = (state: StoreState) => state.config.mod.general.options;

export const getStartingSkills = (state: StoreState) => state.config.mod.general.startingSkills;

export default configSlice.reducer;
