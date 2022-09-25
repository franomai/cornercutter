import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { invoke } from '@tauri-apps/api/tauri';
import ModConfig from '../../../types/Configuration';
import { CornerCutterConfig, CurrentModConfig } from '../../../types/CornerCutterConfig';
import { StoreState } from '../../store';
import { addMods, setEnabledMod } from '../mod';

export interface State {
    config: CornerCutterConfig | null;
}

export const initialState: State = {
    config: null,
};

const cornercutterSlice = createSlice({
    name: 'cornercutter',
    initialState,
    reducers: {
        setCornercutterConfig(state, action: { payload: CornerCutterConfig }) {
            state.config = action.payload;
        },
    },
});

export const { setCornercutterConfig } = cornercutterSlice.actions;

export const getCornercutterConfig = (state: StoreState) => state.cornercutter.config;

export const loadSavedData = createAsyncThunk('cornercutter/loadSavedData', async (_, thunkAPI) => {
    try {
        console.log('Fetching saved data...');
        const [currentModConfig, cornercutterConfig, mods] = await Promise.all([
            invoke<CurrentModConfig>('get_current_mod'),
            invoke<CornerCutterConfig>('get_cornercutter_config'),
            invoke<ModConfig[]>('get_mods'),
        ]);

        thunkAPI.dispatch(setCornercutterConfig(cornercutterConfig));
        thunkAPI.dispatch(addMods(mods));
        thunkAPI.dispatch(setEnabledMod(currentModConfig.currentMod ?? null));
    } catch (err) {
        console.error(err);
    }
});

export default cornercutterSlice.reducer;
