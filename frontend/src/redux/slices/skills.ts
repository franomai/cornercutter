import Skill from '../../types/Skill';
import skills from '../../assets/skills/skills.json';

import { StoreState } from '../store';
import { createSlice } from '@reduxjs/toolkit';

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
