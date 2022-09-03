import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { ConfigContextProvider } from './context/ConfigContext';
import './index.css';
import store from './redux/store';
import theme from './utility/Theme';

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
