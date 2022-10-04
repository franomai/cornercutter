import { setStartingSkills } from '../../../redux/slices/mod';
import { useDispatch } from 'react-redux';

import ContentContainer from '../../layout/ContentContainer';
import ModConfig from '../../../types/Configuration';
import LabelledDropzone from '../../dropzone';
import GeneralOptions from './GeneralOptions';
import ModInformation from './ModInformation';
import { saveSelectedMod } from '../../../redux/slices/saving';
import { AppDispatch } from '../../../redux/store';

const GeneralConfigTab = ({ selectedMod }: { selectedMod: ModConfig }) => {
    const dispatch = useDispatch<AppDispatch>();

    return (
        <ContentContainer>
            <ModInformation selectedMod={selectedMod} />
            <GeneralOptions selectedMod={selectedMod} />
            <LabelledDropzone
                label="Starting Skills"
                tooltip="Grants these skills at the start of the dungeon, or at the start of every floor if the option is selected. Can contain duplicates."
                skills={selectedMod.general.startingSkills}
                handleSetSkills={(skills) => {
                    dispatch(setStartingSkills(skills));
                    dispatch(saveSelectedMod());
                }}
            />
        </ContentContainer>
    );
};

export default GeneralConfigTab;
