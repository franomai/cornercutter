import { createSlice } from '@reduxjs/toolkit';
import { StoreState } from '../../store';

import ModConfig, {
    CurseSpawnType,
    DEFAULT_CONFIG,
    Floor,
    ModInfo,
    Options,
    Room,
    SpawnType,
} from '../../../types/Configuration';
import { generateEmptyFloorSkills, setModOptionFlag } from '../../../utility/ConfigHelpers';
import { WeightedSkill } from '../../../types/Skill';
import { newArray, newMap } from '../../../utility/Utils';

export interface State {
    mods: ModConfig[];
    selectedMod: number;
    enabledMod: number;
}

export type FloorRoom = { floor: Floor; room: Room };

export const initialState: State = {
    mods: [
        {
            id: 0,
            info: {
                name: 'Placeholder mod',
                description: 'This is a mod description...',
            },
            general: DEFAULT_CONFIG,
            floorSkills: generateEmptyFloorSkills(),
        },
    ],
    selectedMod: -1,
    enabledMod: -1,
};

function ifModSelected(state: State, callback: (selectedMod: ModConfig) => void) {
    if (state.selectedMod !== -1) {
        callback(state.mods[state.selectedMod]);
    }
}

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
        setOption(state, action: { payload: { flag: Options; isEnabled: boolean } }) {
            if (state.selectedMod !== -1) {
                setModOptionFlag(state.mods[state.selectedMod], action.payload.flag, action.payload.isEnabled);
            }
        },
        addStartingSkill(state, action: { payload: WeightedSkill }) {
            if (state.selectedMod !== -1) {
                state.mods[state.selectedMod].general.startingSkills.push(action.payload);
            }
        },
        deleteStartingSkill(state, action: { payload: number }) {
            if (state.selectedMod !== -1) {
                state.mods[state.selectedMod].general.startingSkills.splice(action.payload, 1);
            }
        },
        clearStartingSkills(state) {
            if (state.selectedMod !== -1) {
                state.mods[state.selectedMod].general.startingSkills = [];
            }
        },
        updateStartingSkillWeight(state, action: { payload: { skillIndex: number; newWeight: number } }) {
            if (state.selectedMod !== -1) {
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
    state.mod.selectedMod === -1 ? null : state.mod.mods[state.mod.selectedMod];

export const getEnabledMod = (state: StoreState) =>
    state.mod.enabledMod === -1 ? null : state.mod.mods[state.mod.enabledMod];

export const getAllMods = (state: StoreState) => state.mod.mods;

export default modSlice.reducer;
