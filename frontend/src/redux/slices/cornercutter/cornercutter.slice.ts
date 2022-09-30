import { createSlice } from '@reduxjs/toolkit';
import { CornerCutterConfig } from '../../../types/CornerCutterConfig';
import { StoreState } from '../../store';

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

export default cornercutterSlice.reducer;
