import { StoreState } from '../store';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import ModConfig, {
    CurseSpawnType,
    Floor,
    ModInfo,
    MultiSpawnerType,
    ModOptions,
    PedestalSpawnType,
    Room,
    SpawnType,
} from '../../types/Configuration';
import { invoke } from '@tauri-apps/api';
import { WeightedSkill } from '../../types/Skill';
import { setOptionFlag } from '../../utility/ConfigHelpers';

export interface State {
    mods: Record<string, ModConfig>;
    selectedMod: string | null;
    enabledMod: string | null;
}

export type FloorRoom = { floor: Floor; room: Room };

export const initialState: State = {
    mods: {},
    selectedMod: null,
    enabledMod: null,
};

const modSlice = createSlice({
    name: 'mod',
    initialState,
    reducers: {
        setSelectedMod(state, action: { payload: string }) {
            if (state.mods[action.payload]) {
                state.selectedMod = action.payload;
            }
        },
        setEnabledMod(state, action: { payload: string | null }) {
            state.enabledMod = action.payload;
        },
        addMod(state, action: { payload: ModConfig }) {
            state.mods[action.payload.id] = action.payload;
            if (state.selectedMod === null) {
                state.selectedMod = action.payload.id;
            }
        },
        addMods(state, action: { payload: ModConfig[] }) {
            if (state.selectedMod === null && action.payload.length !== 0) {
                state.selectedMod = action.payload[0].id;
            }
            for (const mod of action.payload) {
                state.mods[mod.id] = mod;
            }
        },
        deleteMod(state, action: { payload: string }) {
            delete state.mods[action.payload];
            if (state.selectedMod === action.payload) {
                state.selectedMod = null;
            }
            if (state.enabledMod === action.payload) {
                state.enabledMod = null;
            }
        },
        setModInfo(state, action: { payload: ModInfo }) {
            if (state.selectedMod !== null) {
                state.mods[state.selectedMod].info = action.payload;
            }
        },
        setSpawns(state, action: { payload: SpawnType }) {
            if (state.selectedMod !== null) {
                state.mods[state.selectedMod].general.spawns = action.payload;
            }
        },
        setCurseSpawns(state, action: { payload: CurseSpawnType }) {
            if (state.selectedMod !== null) {
                state.mods[state.selectedMod].general.curseSpawns = action.payload;
            }
        },
        setPedestalSpawns(state, action: { payload: PedestalSpawnType }) {
            if (state.selectedMod !== null) {
                state.mods[state.selectedMod].general.pedestalSpawns = action.payload;
            }
        },
        setMultiSpawners(state, action: { payload: MultiSpawnerType }) {
            if (state.selectedMod !== null) {
                state.mods[state.selectedMod].general.multiSpawners = action.payload;
            }
        },
        setOption(state, action: { payload: { flag: ModOptions; isEnabled: boolean } }) {
            if (state.selectedMod !== null) {
                state.mods[state.selectedMod].general.options = setOptionFlag(
                    state.mods[state.selectedMod].general.options,
                    action.payload.flag,
                    action.payload.isEnabled,
                ) as ModOptions;
            }
        },
        setStartingSkills(state, action: { payload: WeightedSkill[] }) {
            if (state.selectedMod !== null) {
                state.mods[state.selectedMod].general.startingSkills = action.payload;
            }
        },
        setFloorSkills(state, action: { payload: FloorRoom & { skills: WeightedSkill[] } }) {
            if (state.selectedMod !== null) {
                state.mods[state.selectedMod].floorSkills[action.payload.floor][action.payload.room] =
                    action.payload.skills;
            }
        },
    },
});

export const {
    setSelectedMod,
    setEnabledMod,
    addMod,
    addMods,
    deleteMod,
    setModInfo,
    setSpawns,
    setCurseSpawns,
    setPedestalSpawns,
    setMultiSpawners,
    setOption,
    setStartingSkills,
    setFloorSkills,
} = modSlice.actions;

export const getSelectedMod = (state: StoreState) =>
    state.mod.selectedMod ? state.mod.mods[state.mod.selectedMod] : null;

export const getEnabledMod = (state: StoreState) =>
    state.mod.enabledMod ? state.mod.mods[state.mod.enabledMod] : null;

export const getAllMods = (state: StoreState) => state.mod.mods;

export const updateEnabledMod = createAsyncThunk('mod/updateEnabledMod', (modId: string | null, thunkAPI) => {
    invoke('set_enabled_mod', { enabledMod: modId }).then(() => thunkAPI.dispatch(setEnabledMod(modId)));
});

export default modSlice.reducer;
