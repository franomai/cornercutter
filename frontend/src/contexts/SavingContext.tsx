import { createContext, useContext } from 'react';
import { unimplementedFunction } from '../utility/Utils';

export interface SavingContextProps {
    lastSaved: number;
    isSaving: boolean;
    error: string | null;
    save(): void;
    saveSelectedMod(): void;
    setError(error: string | Error): void;
}

const SavingContext = createContext<SavingContextProps>({
    lastSaved: 0,
    isSaving: false,
    error: null,
    save: unimplementedFunction,
    saveSelectedMod: unimplementedFunction,
    setError: unimplementedFunction,
});

const useSavingContext = () => useContext(SavingContext);

export default useSavingContext;
export { SavingContext };
