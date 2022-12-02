import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { ReactNode, useEffect, useState } from 'react';
import { SavingContext } from '../contexts/SavingContext';
import { saveSelectedMod as reduxSaveSelectedMod } from '../redux/slices/saving';

export default function SavingContextProvider({ children }: { children: ReactNode }) {
    const dispatch = useDispatch<AppDispatch>();

    const [lastSaved, setLastSaved] = useState(Date.now());
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isSaving) {
            const timeout = setTimeout(() => setIsSaving(false), 350);
            return () => clearTimeout(timeout);
        }
    }, [isSaving]);

    const save = () => {
        setIsSaving(true);
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
                isSaving,
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
