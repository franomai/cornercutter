import { ReactNode, useEffect, useState } from 'react';
import { SavingContext } from '../contexts/SavingContext';

export default function SavingContextProvider({ children }: { children: ReactNode }) {
    const [lastSaved, setLastSaved] = useState(0);
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

    return (
        <SavingContext.Provider
            value={{
                lastSaved,
                isSaving,
                error,
                save,
                setError,
            }}
        >
            {children}
        </SavingContext.Provider>
    );
}
