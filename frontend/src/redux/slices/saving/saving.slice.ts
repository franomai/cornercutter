import ModConfig from '../../../types/Configuration';

import { createAsyncThunk, createSlice, SerializedError } from '@reduxjs/toolkit';
import { invoke } from '@tauri-apps/api/tauri';
import { CornerCutterConfig, CurrentModConfig } from '../../../types/CornerCutterConfig';
import { StoreState } from '../../store';
import { setCornercutterConfig } from '../cornercutter';
import { addMods, setEnabledMod } from '../mod';

export interface State {
    status: 'idle' | 'pending';
    currentRequestId?: string;
    lastSaved: number;
    error: SerializedError | null;
}

export const initialState: State = {
    status: 'idle',
    lastSaved: Date.now(),
    error: null,
};

const savingSlice = createSlice({
    name: 'saving',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(saveSelectedMod.pending, (state, action) => {
                if (state.status === 'idle') {
                    state.status = 'pending';
                    state.currentRequestId = action.meta.requestId;
                }
            })
            .addCase(saveSelectedMod.fulfilled, (state, action) => {
                if (state.status === 'pending' && state.currentRequestId === action.meta.requestId) {
                    state.status = 'idle';
                    state.currentRequestId = undefined;
                    state.lastSaved = Date.now();
                    state.error = null;
                }
            })
            .addCase(saveSelectedMod.rejected, (state, action) => {
                if (state.status === 'pending' && state.currentRequestId === action.meta.requestId) {
                    state.status = 'idle';
                    state.currentRequestId = action.meta.requestId;
                    state.error = action.error;
                }
            });
    },
});

export const saveSelectedMod = createAsyncThunk<void, undefined, { state: StoreState }>(
    'savings/saveSelectedMod',
    async (_, { getState, requestId }) => {
        const state = getState();
        // Before this is invoked, the `pending` case is executed, so we need to check that this is referring
        // to the same request by checking the requestId
        if (state.mod.selectedMod === null || state.saving.currentRequestId !== requestId) {
            return;
        }
        const selectedMod = state.mod.mods[state.mod.selectedMod];
        await invoke<void>('save_mod', { modConfig: selectedMod });
    },
);

export const loadSavedData = createAsyncThunk<void, undefined, { state: StoreState }>(
    'cornercutter/loadSavedData',
    async (_, thunkAPI) => {
        try {
            console.log('Fetching saved data...');
            const [currentModConfig, cornercutterConfig, mods] = await Promise.all([
                invoke<CurrentModConfig>('get_current_mod'),
                invoke<CornerCutterConfig>('get_cornercutter_config'),
                invoke<ModConfig[]>('get_mods'),
            ]);

            thunkAPI.dispatch(setCornercutterConfig(cornercutterConfig));
            thunkAPI.dispatch(addMods(mods));
            thunkAPI.dispatch(setEnabledMod(currentModConfig.currentMod?.replace(/.json$/, '') ?? null));
        } catch (err) {
            console.error(err);
        }
    },
);

export const getSavingState = (store: StoreState) => store.saving;

export default savingSlice.reducer;
