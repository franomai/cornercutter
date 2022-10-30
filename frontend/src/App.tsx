import ModdingConfig from './components/pages/ModdingConfig';
import createTheme from './theme';

import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from './redux/store';
import { loadSavedData } from './redux/slices/saving';
import { ChakraProvider, ColorModeScript, useColorMode } from '@chakra-ui/react';
import { getColours } from './redux/slices/theme';

import './App.css';

function App() {
    const dispatch = useDispatch<AppDispatch>();
    const colours = useSelector(getColours);
    const colourModeContext = useColorMode();
    const theme = useMemo(() => createTheme(colours), [colours]);

    useEffect(() => {
        dispatch(loadSavedData());
    }, []);

    useEffect(() => {
        if (colourModeContext.setColorMode) {
            colourModeContext.setColorMode('light');
        } else {
            console.log(colourModeContext);
        }
    }, [colourModeContext]);

    return (
        <ChakraProvider theme={theme}>
            <ModdingConfig />
        </ChakraProvider>
    );
}

export default App;
