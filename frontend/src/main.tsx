import './index.css';
import App from './App';
import store from './redux/store';
import theme from './utility/Theme';
import ReactDOM from 'react-dom/client';

import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { ChakraProvider } from '@chakra-ui/react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import SavingContextProvider from './providers/SavingContextProvider';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <ChakraProvider theme={theme}>
            <DndProvider backend={HTML5Backend}>
                <SavingContextProvider>
                    <App />
                </SavingContextProvider>
            </DndProvider>
        </ChakraProvider>
    </Provider>,
);
