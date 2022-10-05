import ModdingConfig from './components/pages/ModdingConfig';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './redux/store';
import { loadSavedData } from './redux/slices/saving';

import './App.css';

function App() {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(loadSavedData());
    }, []);

    return <ModdingConfig />;
}

export default App;
