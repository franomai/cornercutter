import { createSlice } from '@reduxjs/toolkit';
import { StoreState } from '../../store';

import Skill from '../../../types/Skill';
import skills from '../../../assets/skills/skills.json';

export interface State {
    skills: Record<number, Skill>;
}

export const initialState: State = {
    skills: Object.fromEntries(skills.map((skill) => [skill.id, skill])),
};

const skillsSlice = createSlice({
    name: 'skills',
    initialState,
    reducers: {},
});

export const getAllSkills = (state: StoreState) => state.skills.skills;

export default skillsSlice.reducer;
