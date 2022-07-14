import { ReactNode } from 'react';

export default interface SearchColumnItem {
    id: string;
    name: string;
    render: ReactNode;
}
