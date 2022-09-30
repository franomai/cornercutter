import { createAsyncThunk, createSlice, SerializedError } from '@reduxjs/toolkit';
import { invoke } from '@tauri-apps/api/tauri';
import { StoreState } from '../../store';

export interface State {
    status: 'idle' | 'pending';
    error: SerializedError | null;
}

export const initialState: State = {
    status: 'idle',
    error: null,
};

const savingSlice = createSlice({
    name: 'saving',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(saveSelectedMod.pending, (state) => {
                if (state.status === 'idle') {
                    state.status = 'pending';
                }
            })
            .addCase(saveSelectedMod.fulfilled, (state) => {
                if (state.status === 'pending') {
                    state.status = 'idle';
                    state.error = null;
                }
            })
            .addCase(saveSelectedMod.rejected, (state, action) => {
                if (state.status === 'pending') {
                    state.status = 'idle';
                    state.error = action.error;
                }
            });
    },
});

export const saveSelectedMod = createAsyncThunk<void, undefined, { state: StoreState }>(
    'savings/saveSelectedMod',
    async (_, { getState }) => {
        const state = getState();
        if (state.saving.status !== 'idle' || state.mod.selectedMod === null) {
            return;
        }
        await invoke('save_mod', { modConfig: state.mod.mods[state.mod.selectedMod] });
    },
);

export const getSavingStatus = (state: StoreState) => state.saving.status;

export const getSavingError = (state: StoreState) => state.saving.error;

export default savingSlice.reducer;
