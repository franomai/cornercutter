import { ChakraProvider } from '@chakra-ui/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Provider } from 'react-redux';

import ReactGA from 'react-ga4';
import ReactDOM from 'react-dom/client';
import App from './App';
import store from './redux/store';
import theme from './utility/Theme';
import './index.css';

ReactGA.initialize(import.meta.env.VITE_MEASUREMENT_ID);
ReactGA.send('pageview');

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <ChakraProvider theme={theme}>
            <DndProvider backend={HTML5Backend}>
                <App />
            </DndProvider>
        </ChakraProvider>
    </Provider>,
);
