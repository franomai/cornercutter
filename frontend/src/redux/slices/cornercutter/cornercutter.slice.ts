import { createSlice } from '@reduxjs/toolkit';
import { GlobalOptions } from '../../../types/Configuration';
import { CornerCutterConfig } from '../../../types/CornerCutterConfig';
import { StoreState } from '../../store';

export interface State {
    config: CornerCutterConfig | null;
    globalOptions: GlobalOptions;
    isUserMetricsEnabled: boolean;
}

export const initialState: State = {
    config: null,
    globalOptions: GlobalOptions.NoneSelected,
    isUserMetricsEnabled: true,
};

const cornercutterSlice = createSlice({
    name: 'cornercutter',
    initialState,
    reducers: {
        setCornercutterConfig(state, action: { payload: CornerCutterConfig }) {
            state.config = action.payload;
        },
        setGlobalOptions(state, action: { payload: GlobalOptions }) {
            state.globalOptions = action.payload;
        },
        setIsUserMetricsEnabled(state, action: { payload: boolean }) {
            state.isUserMetricsEnabled = action.payload;
        },
    },
});

export const { setCornercutterConfig, setGlobalOptions, setIsUserMetricsEnabled } = cornercutterSlice.actions;

export const getCornercutterConfig = (state: StoreState) => state.cornercutter.config;

export const getGlobalOptions = (state: StoreState) => state.cornercutter.globalOptions;

export const getIsUserMetricsEnabled = (state: StoreState) => state.cornercutter.isUserMetricsEnabled;

export default cornercutterSlice.reducer;
