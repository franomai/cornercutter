import { StoreState } from '../../store';
import { createSlice } from '@reduxjs/toolkit';
import { GlobalOptions } from '../../../types/Configuration';
import { CornerCutterConfig } from '../../../types/CornerCutterConfig';

export interface State {
    config: CornerCutterConfig | null;
    globalOptions: GlobalOptions;
}

export const initialState: State = {
    config: null,
    globalOptions: GlobalOptions.NoneSelected,
};

const cornercutterSlice = createSlice({
    name: 'cornercutter',
    initialState,
    reducers: {
        setCornercutterConfig(state, action: { payload: CornerCutterConfig }) {
            state.config = action.payload;
        },
        setCornercutterDir(state, action: { payload: string }) {
            if (state.config) {
                state.config.goingUnderDir = action.payload;
                state.config.setDirectory = true;
            }
        },
        setEnableUserMetrics(state, action: { payload: boolean }) {
            if (state.config) {
                state.config.enableUserMetrics = action.payload;
            }
        },
        setIsNotFirstStartup(state) {
            if (state.config) {
                state.config.isFirstStartup = false;
            }
        },
        setGlobalOptions(state, action: { payload: GlobalOptions }) {
            state.globalOptions = action.payload;
        },
    },
});

export const {
    setCornercutterConfig,
    setCornercutterDir,
    setEnableUserMetrics,
    setIsNotFirstStartup,
    setGlobalOptions,
} = cornercutterSlice.actions;

export const getCornercutterConfig = (state: StoreState) => state.cornercutter.config;

export const getGlobalOptions = (state: StoreState) => state.cornercutter.globalOptions;

export const getEnableUserMetrics = (state: StoreState) => state.cornercutter.config?.enableUserMetrics ?? false;

export default cornercutterSlice.reducer;
