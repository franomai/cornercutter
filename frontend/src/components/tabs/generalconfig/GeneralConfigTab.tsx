import {
    addStartingSkill,
    clearStartingSkills,
    deleteStartingSkill,
    updateStartingSkillWeight,
} from '../../../redux/slices/mod';
import { Stack } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { SkillSearchColumn } from '../../searchbar';

import ContentContainer from '../../layout/ContentContainer';
import ModConfig from '../../../types/Configuration';
import LabelledDropzone from '../../dropzone';
import GeneralOptions from './GeneralOptions';
import ModInformation from './ModInformation';
import SideSearchColumnLayout from '../../layout/SideSearchColumnLayout';

const GeneralConfigTab = ({ selectedMod }: { selectedMod: ModConfig }) => {
    const dispatch = useDispatch();

    return (
        <SideSearchColumnLayout>
            <ModInformation selectedMod={selectedMod} />
            <GeneralOptions selectedMod={selectedMod} />
            <LabelledDropzone
                label="Starting Skills"
                skills={selectedMod.general.startingSkills}
                handleDropSkill={(weightedSkill) => dispatch(addStartingSkill(weightedSkill))}
                handleDeleteSkill={(skillIndex) => dispatch(deleteStartingSkill(skillIndex))}
                handleClearAllSkills={() => dispatch(clearStartingSkills())}
                handleUpdateSkillWeight={(skillIndex, newWeight) =>
                    dispatch(updateStartingSkillWeight({ skillIndex, newWeight }))
                }
            />
        </SideSearchColumnLayout>
    );
};

export default GeneralConfigTab;
