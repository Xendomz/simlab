import { Practicum } from "../practicum/Practicum";

export class PracticumModule {
    constructor(
        readonly id: number,
        readonly name: string,
        readonly status: 'Active' | 'Deactive',
        readonly practicum?: Practicum,
    ){}
}