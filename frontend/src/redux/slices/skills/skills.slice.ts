import { createSlice } from '@reduxjs/toolkit';
import { loadSkills } from '../../../utility/SkillsHelper';
import { StoreState } from '../../store';

import Skill from '../../../types/Skill';

export interface State {
    skills: Record<number, Skill>;
}

export const initialState: State = {
    skills: loadSkills(),
};

const skillsSlice = createSlice({
    name: 'skills',
    initialState,
    reducers: {},
});

export const getAllSkills = (state: StoreState) => state.skills.skills;

export default skillsSlice.reducer;
