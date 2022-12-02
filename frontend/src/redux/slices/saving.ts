import ModConfig from '../../types/Configuration';

import { StoreState } from '../store';
import { invoke } from '@tauri-apps/api/tauri';
import { addMods, setEnabledMod } from './mod';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { setCornercutterConfig, setGlobalOptions } from './cornercutter';
import { CornercutterConfig, CornercutterModSettings } from '../../types/CornercutterConfig';

export const saveSelectedMod = createAsyncThunk<void, undefined, { state: StoreState }>(
    'cornercutter/saveSelectedMod',
    async (_, { getState }) => {
        const state = getState();
        if (state.mod.selectedMod !== null) {
            const selectedMod = state.mod.mods[state.mod.selectedMod];
            await invoke<void>('save_mod', { modConfig: selectedMod });
        }
    },
);

export const loadSavedData = createAsyncThunk<void, undefined, { state: StoreState }>(
    'cornercutter/loadSavedData',
    async (_, thunkAPI) => {
        try {
            console.log('Fetching saved data...');
            const [settings, cornercutterConfig, mods] = await Promise.all([
                invoke<CornercutterModSettings>('get_settings'),
                invoke<CornercutterConfig>('get_cornercutter_config'),
                invoke<ModConfig[]>('get_mods'),
            ]);

            console.log(settings);

            thunkAPI.dispatch(setCornercutterConfig(cornercutterConfig));
            thunkAPI.dispatch(addMods(mods));
            thunkAPI.dispatch(setEnabledMod(settings.currentMod?.replace(/.json$/, '') ?? null));
            thunkAPI.dispatch(setGlobalOptions(settings.globalOptions));
        } catch (err) {
            console.error(err);
        }
    },
);
