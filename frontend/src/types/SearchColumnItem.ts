import { ReactNode } from 'react';

export default interface SearchColumnItem {
    id: number;
    name: string;
    render: ReactNode;
}
