import { ReactNode } from 'react';

export interface ItemType {
    id: string;
    render: (item: Item) => ReactNode;
}

export interface Item {
    id: number;
    name: string;
}
