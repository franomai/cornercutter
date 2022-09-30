import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { StoreState } from '../../store';

import ModConfig, { CurseSpawnType, Floor, ModInfo, Options, Room, SpawnType } from '../../../types/Configuration';
import { setModOptionFlag } from '../../../utility/ConfigHelpers';
import { WeightedSkill } from '../../../types/Skill';
import { invoke } from '@tauri-apps/api';
import { saveSelectedMod } from '../saving';

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

function ifModSelected(state: State, callback: (selectedMod: ModConfig) => void) {
    if (state.selectedMod !== null) {
        callback(state.mods[state.selectedMod]);
    }
}

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
        setOption(state, action: { payload: { flag: Options; isEnabled: boolean } }) {
            if (state.selectedMod !== null) {
                setModOptionFlag(state.mods[state.selectedMod], action.payload.flag, action.payload.isEnabled);
            }
        },
        addStartingSkill(state, action: { payload: WeightedSkill }) {
            if (state.selectedMod !== null) {
                state.mods[state.selectedMod].general.startingSkills.push(action.payload);
            }
        },
        deleteStartingSkill(state, action: { payload: number }) {
            if (state.selectedMod !== null) {
                state.mods[state.selectedMod].general.startingSkills.splice(action.payload, 1);
            }
        },
        clearStartingSkills(state) {
            if (state.selectedMod !== null) {
                state.mods[state.selectedMod].general.startingSkills = [];
            }
        },
        updateStartingSkillWeight(state, action: { payload: { skillIndex: number; newWeight: number } }) {
            if (state.selectedMod !== null) {
                const startingSkills = state.mods[state.selectedMod].general.startingSkills;
                startingSkills[action.payload.skillIndex].weight = action.payload.newWeight;
            }
        },
        addFloorSkill(state, action: { payload: FloorRoom & { skill: WeightedSkill } }) {
            ifModSelected(state, (selectedMod) =>
                selectedMod.floorSkills[action.payload.floor][action.payload.room].push(action.payload.skill),
            );
        },
        deleteFloorSkill(state, action: { payload: FloorRoom & { skillIndex: number } }) {
            ifModSelected(state, (selectedMod) =>
                selectedMod.floorSkills[action.payload.floor][action.payload.room].splice(action.payload.skillIndex, 1),
            );
        },
        clearFloorSkills(state, action: { payload: FloorRoom }) {
            ifModSelected(
                state,
                (selectedMod) => (selectedMod.floorSkills[action.payload.floor][action.payload.room] = []),
            );
        },
        updateFloorSkillWeight(state, action: { payload: FloorRoom & { skillIndex: number; newWeight: number } }) {
            ifModSelected(
                state,
                (selectedMod) =>
                    (selectedMod.floorSkills[action.payload.floor][action.payload.room][
                        action.payload.skillIndex
                    ].weight = action.payload.newWeight),
            );
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
    setOption,
    addStartingSkill,
    deleteStartingSkill,
    clearStartingSkills,
    updateStartingSkillWeight,
    addFloorSkill,
    deleteFloorSkill,
    clearFloorSkills,
    updateFloorSkillWeight,
} = modSlice.actions;

export const getSelectedMod = (state: StoreState) =>
    state.mod.selectedMod ? state.mod.mods[state.mod.selectedMod] : null;

export const getEnabledMod = (state: StoreState) =>
    state.mod.enabledMod ? state.mod.mods[state.mod.enabledMod] : null;

export const getAllMods = (state: StoreState) => state.mod.mods;

export const updateEnabledMod = createAsyncThunk('mod/updateEnabledMod', (modId: string | null, thunkAPI) => {
    invoke('set_enabled_mod', { enabledMod: modId }).then(() => thunkAPI.dispatch(setEnabledMod(modId)));
});

export const updateSelectedMod = createAsyncThunk('mod/updateSelectedMod', async (modId: string, { dispatch }) => {
    dispatch(saveSelectedMod);
    dispatch(setSelectedMod(modId));
});

export default modSlice.reducer;
