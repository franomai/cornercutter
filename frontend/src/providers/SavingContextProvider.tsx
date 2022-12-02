import { useDispatch } from 'react-redux';
import { ReactNode, useState } from 'react';
import { AppDispatch } from '../redux/store';
import { SavingContext } from '../contexts/SavingContext';
import { saveSelectedMod as reduxSaveSelectedMod } from '../redux/slices/saving';

export default function SavingContextProvider({ children }: { children: ReactNode }) {
    const dispatch = useDispatch<AppDispatch>();

    const [lastSaved, setLastSaved] = useState(Date.now());
    const [error, setError] = useState<string | null>(null);

    const save = () => {
        setError(null);
        setLastSaved(Date.now());
    };

    const saveSelectedMod = () => {
        dispatch(reduxSaveSelectedMod()).catch(handleError);
        save();
    };

    const handleError = (error: string | Error) => {
        if (typeof error === 'string') {
            setError(error);
        } else {
            setError(error.message);
        }
    };

    return (
        <SavingContext.Provider
            value={{
                lastSaved,
                error,
                save,
                saveSelectedMod,
                setError: handleError,
            }}
        >
            {children}
        </SavingContext.Provider>
    );
}
