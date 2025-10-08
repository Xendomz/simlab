import { PracticumScheduling } from "@/domain/practicum-scheduling/PracticumScheduling";
import { AcademicYearAPI, toDomain as toAcademicYear } from "../academic-year/AcademicYearAPI";
import { UserApi, toDomain as toUser } from "../user/UserApi";
import { PracticumApprovalAPI, toDomain as toPracticumApproval } from "./PracticumApprovalAPI";
import { PracticumSchedulingEquipmentAPI, toDomain as toPracticumSchedulingEquipment } from "./PracticumSchedulingEquipmentAPI";
import { PracticumSchedulingMaterialAPI, toDomain as toPracticumSchedulingMaterial  } from "./PracticumSchedulingMaterialAPI";
import { Time } from "@/domain/time/Time";
import { PracticumSchedulingStatus } from "@/domain/practicum-scheduling/PracticumSchedulingStatus";
import { PracticumAPI, toDomain as toPracticum } from "../practicum/PracticumAPI";
import { PracticumClassAPI, toDomain as toPracticumClass } from "./PracticumClassAPI";

export type PracticumSchedulingAPI = {
    id: number;
    phone_number: number
    status: string
    created_at: string;
    updated_at: string;
    academic_year?: AcademicYearAPI;
    user?: UserApi;
    laboran?: UserApi;
    practicum?: PracticumAPI;
    practicum_classes?: PracticumClassAPI[];
    practicum_scheduling_equipments?: PracticumSchedulingEquipmentAPI[];
    practicum_scheduling_materials?: PracticumSchedulingMaterialAPI[];
    kepala_lab_approval?: PracticumApprovalAPI;
    laboran_approval?: PracticumApprovalAPI;
}

export function toDomain(api: PracticumSchedulingAPI): PracticumScheduling {
    return new PracticumScheduling(
        api.id,
        api.phone_number,
        api.status as PracticumSchedulingStatus,
        new Time(api.created_at),
        new Time(api.updated_at),
        api.academic_year ? toAcademicYear(api.academic_year) : undefined,
        api.user ? toUser(api.user) : undefined,
        api.laboran ? toUser(api.laboran) : undefined,
        api.practicum ? toPracticum(api.practicum) : undefined,
        api.practicum_classes ? api.practicum_classes.map(toPracticumClass) : undefined,
        api.practicum_scheduling_equipments ? api.practicum_scheduling_equipments.map(toPracticumSchedulingEquipment) : undefined,
        api.practicum_scheduling_materials ? api.practicum_scheduling_materials.map(toPracticumSchedulingMaterial) : undefined,
        api.kepala_lab_approval ? toPracticumApproval(api.kepala_lab_approval) : undefined,
        api.laboran_approval ? toPracticumApproval(api.laboran_approval) : undefined,
    );
}