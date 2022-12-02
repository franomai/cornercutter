import { createContext, useContext } from 'react';
import { unimplementedFunction } from '../utility/Utils';

export interface SavingContextProps {
    lastSaved: number;
    isSaving: boolean;
    error: string | null;
    save(): void;
    setError(error: string): void;
}

const SavingContext = createContext<SavingContextProps>({
    lastSaved: 0,
    isSaving: false,
    error: null,
    save: unimplementedFunction,
    setError: unimplementedFunction,
});

const useSavingContext = () => useContext(SavingContext);

export default useSavingContext;
export { SavingContext };
