import ModdingConfig from './components/pages/ModdingConfig';
import { loadSavedData } from './redux/slices/cornercutter';
import { useEffect } from 'react';
import './App.css';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './redux/store';

function App() {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(loadSavedData());
    }, []);

    return <ModdingConfig />;
}

export default App;
