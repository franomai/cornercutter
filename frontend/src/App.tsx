import ModdingConfig from './components/pages/ModdingConfig';
import createTheme from './theme';

import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from './redux/store';
import { loadSavedData } from './redux/slices/saving';
import { ChakraProvider } from '@chakra-ui/react';
import { getColours } from './redux/slices/theme';

import './App.css';

function App() {
    const dispatch = useDispatch<AppDispatch>();
    const colours = useSelector(getColours);

    const theme = useMemo(() => createTheme(colours), [colours]);

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
