import GeneralOptions from './GeneralOptions';
import ModInformation from './ModInformation';
import ModConfig from '../../../types/Configuration';
import ContentContainer from '../../layout/ContentContainer';
import useSavingContext from '../../../contexts/SavingContext';
import LabelledDropzone from '../../dropzone/LabelledDropzone';

import { useDispatch } from 'react-redux';
import { setStartingSkills } from '../../../redux/slices/mod';

export default function GeneralConfigTab({ selectedMod }: { selectedMod: ModConfig }) {
    const dispatch = useDispatch();
    const { saveSelectedMod } = useSavingContext();

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
                    saveSelectedMod();
                }}
            />
        </ContentContainer>
    );
}
