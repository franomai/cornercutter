import { createContext, FC, ReactNode, useContext, useState } from 'react';
import Configuration, { DEFAULT_CONFIG } from '../types/Configuration';

type ConfigContextValue = [Configuration, React.Dispatch<React.SetStateAction<Configuration>>];

interface Props {
    children?: ReactNode;
}

const ConfigContext = createContext<ConfigContextValue>([DEFAULT_CONFIG, () => {}]);

const useConfigContext = () => useContext(ConfigContext);

const ConfigContextProvider: FC<Props> = (props) => {
    const [config, setConfig] = useState<Configuration>(DEFAULT_CONFIG);

    const contextValue: ConfigContextValue = [config, setConfig];

    return <ConfigContext.Provider value={contextValue}>{props.children}</ConfigContext.Provider>;
};

export default useConfigContext;
export { ConfigContextProvider };
export type { ConfigContextValue };
