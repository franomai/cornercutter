import ModdingConfig from './components/pages/ModdingConfig';
import { loadSavedData } from './redux/slices/cornercutter';
import { useEffect } from 'react';
import './App.css';

function App() {
    useEffect(() => {
        loadSavedData();
    }, []);

    return <ModdingConfig />;
}

export default App;
