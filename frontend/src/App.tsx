import ModdingConfig from './components/pages/ModdingConfig';
import createTheme from './theme';

import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './redux/store';
import { loadSavedData } from './redux/slices/saving';
import { ChakraProvider } from '@chakra-ui/react';
import { createVariants, ThemeColours } from './theme/ThemeUtils';

import './App.css';

const themeColours: ThemeColours = {
    bg: createVariants('red.300'),
    primary: createVariants('orange.200'),
};

function App() {
    const dispatch = useDispatch<AppDispatch>();
    const theme = useMemo(() => createTheme(themeColours), []);

    useEffect(() => {
        dispatch(loadSavedData());
    }, []);

    return (
        <ChakraProvider theme={theme}>
            <ModdingConfig />
        </ChakraProvider>
    );
}

export default App;
