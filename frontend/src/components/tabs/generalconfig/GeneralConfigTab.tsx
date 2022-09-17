import {
    addStartingSkill,
    clearStartingSkills,
    deleteStartingSkill,
    updateStartingSkillWeight,
} from '../../../redux/slices/mod';
import { Stack } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { SkillSearchColumn } from '../../searchbar';

import ContentContainer from '../ContentContainer';
import ModConfig from '../../../types/Configuration';
import LabelledDropzone from '../../dropzone';
import GeneralOptions from './GeneralOptions';
import ModInformation from './ModInformation';

const GeneralConfigTab = ({ selectedMod }: { selectedMod: ModConfig }) => {
    const dispatch = useDispatch();

    // async function submitConfig() {
    //     const res = await invoke<string>('accept_config', { config: convertKeysToSnakeCase(config) });
    // }

    return (
        <Stack direction="row" maxH="full" h="full" overflow="hidden">
            <ContentContainer>
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
            </ContentContainer>
            <SkillSearchColumn />
        </Stack>
    );
};

export default GeneralConfigTab;
