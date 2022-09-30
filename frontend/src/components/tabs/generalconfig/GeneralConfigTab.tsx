import {
    addStartingSkill,
    clearStartingSkills,
    deleteStartingSkill,
    updateStartingSkillWeight,
} from '../../../redux/slices/mod';
import { useDispatch } from 'react-redux';

import ContentContainer from '../../layout/ContentContainer';
import ModConfig from '../../../types/Configuration';
import LabelledDropzone from '../../dropzone';
import GeneralOptions from './GeneralOptions';
import ModInformation from './ModInformation';

const GeneralConfigTab = ({ selectedMod }: { selectedMod: ModConfig }) => {
    const dispatch = useDispatch();

    return (
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
    );
};

export default GeneralConfigTab;
