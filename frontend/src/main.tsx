import { createVariants, ThemeColours } from './theme/ThemeUtils';
import { ChakraProvider } from '@chakra-ui/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Provider } from 'react-redux';
import { useMemo } from 'react';

import ReactDOM from 'react-dom/client';
import App from './App';
import store from './redux/store';
import createTheme from './theme';
import './index.css';

const themeColours: ThemeColours = {
    bg: 'red.300',
    primary: createVariants('orange.200'),
};

const Root = () => {
    const theme = useMemo(() => createTheme(themeColours), []);

    return (
        <ChakraProvider theme={theme}>
            <DndProvider backend={HTML5Backend}>
                <App />
            </DndProvider>
        </ChakraProvider>
    );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <Root />
    </Provider>,
);
