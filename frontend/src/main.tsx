import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ConfigContextProvider } from './context/ConfigContext';
import './index.css';
import theme from './theme';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ChakraProvider theme={theme}>
            <DndProvider backend={HTML5Backend}>
                <ConfigContextProvider>
                    <App />
                </ConfigContextProvider>
            </DndProvider>
        </ChakraProvider>
    </React.StrictMode>,
);
