import {Item} from "./item.interface";

export interface Restaurant {
    _id?: string;
    name: string;
    phone: string;
    menu?: string;
    delivery: number;
    tax: number;
    items: Item[]
}
