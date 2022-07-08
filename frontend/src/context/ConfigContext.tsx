import { createContext, FC, ReactNode, useContext, useState } from 'react';
import Configuration, { DEFAULT_CONFIG } from '../types/Configuration';

interface ConfigContextProps {
    config: Configuration;
    setConfig: React.Dispatch<React.SetStateAction<Configuration>>;
}

interface Props {
    children?: ReactNode;
}

const ConfigContext = createContext<ConfigContextProps>({
    config: DEFAULT_CONFIG,
    setConfig: () => {},
});

const useConfigContext = () => useContext(ConfigContext);

const ConfigContextProvider: FC<Props> = (props) => {
    const [config, setConfig] = useState<Configuration>(DEFAULT_CONFIG);

    const contextValue: ConfigContextProps = {
        config,
        setConfig,
    };

    return <ConfigContext.Provider value={contextValue}>{props.children}</ConfigContext.Provider>;
};

export default useConfigContext;
export { ConfigContextProvider };
export type { ConfigContextProps };
