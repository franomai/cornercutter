import { ChakraProvider } from '@chakra-ui/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Provider } from 'react-redux';
import { ConfigContextProvider } from './context/ConfigContext';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import store from './redux/store';
import theme from './utility/Theme';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <ChakraProvider theme={theme}>
                <DndProvider backend={HTML5Backend}>
                    <ConfigContextProvider>
                        <App />
                    </ConfigContextProvider>
                </DndProvider>
            </ChakraProvider>
        </Provider>
    </React.StrictMode>,
);
