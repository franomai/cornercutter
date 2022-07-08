import { Container } from '@chakra-ui/react';
import './App.css';
import GeneralConfig from './pages/GeneralConfig';

function App() {
    return (
        <div className="App">
            <Container my={4} maxW="800px">
                <GeneralConfig />
            </Container>
        </div>
    );
}

export default App;
