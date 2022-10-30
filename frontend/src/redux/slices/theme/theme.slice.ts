import { createSlice } from '@reduxjs/toolkit';
import { createVariants, ThemeColours } from '../../../theme/ThemeUtils';
import { StoreState } from '../../store';

export const initialState: ThemeColours = {
    bg: createVariants('gray.800'),
    primary: createVariants('green.200'),
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setBg(state, action: { payload: string }) {
            state.bg = createVariants(action.payload);
        },
        setPrimary(state, action: { payload: string }) {
            state.primary = createVariants(action.payload);
        },
    },
});

export const { setBg, setPrimary } = themeSlice.actions;

export const getColours = (state: StoreState) => state.theme;

export default themeSlice.reducer;
