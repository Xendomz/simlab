import { PracticumModuleSelect } from "../practicum-module/PracticumModuleSelect";

export class PracticumSelect {
    constructor(
        readonly id: number,
        readonly name: string,
        readonly practicumModules?: PracticumModuleSelect[]
    ){}
}