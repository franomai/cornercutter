import { StoreState } from '../../store';
import { createSlice } from '@reduxjs/toolkit';
import { GlobalOptions } from '../../../types/Configuration';
import { CornercutterConfig } from '../../../types/CornercutterConfig';

export interface State {
    config: CornercutterConfig | null;
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
        setCornercutterConfig(state, action: { payload: CornercutterConfig }) {
            state.config = action.payload;
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

export const { setCornercutterConfig, setEnableUserMetrics, setIsNotFirstStartup, setGlobalOptions } =
    cornercutterSlice.actions;

export const getCornercutterConfig = (state: StoreState) => state.cornercutter.config;

export const getGlobalOptions = (state: StoreState) => state.cornercutter.globalOptions;

export const getEnableUserMetrics = (state: StoreState) => state.cornercutter.config?.enableUserMetrics ?? false;

export default cornercutterSlice.reducer;
