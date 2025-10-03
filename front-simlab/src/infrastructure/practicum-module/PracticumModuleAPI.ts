import { PracticumModule } from "@/domain/practicum-module/PracticumModule";
import { PracticumAPI, toDomain as toPracticum } from "../practicum/PracticumAPI";

export type PracticumModuleAPI =  {
    id: number;
    name: string;
    status: 'Active' | 'Deactive';
    practicum?: PracticumAPI
}

export function toDomain(api: PracticumModuleAPI): PracticumModule {
    return new PracticumModule(
        api.id,
        api.name,
        api.status,
        api.practicum ? toPracticum(api.practicum) : undefined
    )
}