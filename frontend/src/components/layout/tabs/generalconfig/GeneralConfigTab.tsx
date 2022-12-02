import GeneralOptions from './GeneralOptions';
import ModInformation from './ModInformation';
import ModConfig from '../../../../types/Configuration';
import ContentContainer from '../../ContentContainer';
import LabelledDropzone from '../../../dropzone/LabelledDropzone';

import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../redux/store';
import { setStartingSkills } from '../../../../redux/slices/mod';
import { saveSelectedMod } from '../../../../redux/slices/saving';

export default function GeneralConfigTab({ selectedMod }: { selectedMod: ModConfig }) {
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
}
