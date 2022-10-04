import { setStartingSkills } from '../../../redux/slices/mod';
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
                tooltip="Grants these skills at the start of the dungeon, or at the start of every floor if the option is selected. Can contain duplicates."
                skills={selectedMod.general.startingSkills}
                handleSetSkills={(skills) => dispatch(setStartingSkills(skills))}
            />
        </ContentContainer>
    );
};

export default GeneralConfigTab;
