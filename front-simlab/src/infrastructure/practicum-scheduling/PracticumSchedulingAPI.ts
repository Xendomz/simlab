import { PracticumScheduling } from "@/domain/practicum-scheduling/PracticumScheduling";
import { AcademicYearAPI, toDomain as toAcademicYear } from "../academic-year/AcademicYearAPI";
import { LaboratoryRoomAPI, toDomain as toLaboratoryRoom } from "../laboratory-room/LaboratoryRoomAPI";
import { UserApi, toDomain as toUser } from "../user/UserApi";
import { PracticumApprovalAPI, toDomain as toPracticumApproval } from "./PracticumApprovalAPI";
import { PracticumGroupAPI, toDomain as toPracticumGroup } from "./PracticumGroupAPI";
import { PracticumSchedulingEquipmentAPI, toDomain as toPracticumSchedulingEquipment } from "./PracticumSchedulingEquipmentAPI";
import { PracticumSchedulingMaterialAPI, toDomain as toPracticumSchedulingMaterial  } from "./PracticumSchedulingMaterialAPI";
import { Time } from "@/domain/time/Time";
import { PracticalWorkAPI, toDomain as toPracticalWork } from "../practical-work/PracticalWorkAPI";

export type PracticumSchedulingAPI = {
    id: number;
    academic_year_id: number;
    user_id: number;
    ruangan_laboratorium_id: number;
    praktikum_id: number;
    phone_number: number
    status: 'draft' | 'submitted'
    created_at: string;
    updated_at: string;
    academicYear?: AcademicYearAPI;
    user?: UserApi;
    laboratory_room?: LaboratoryRoomAPI;
    practicum?: PracticalWorkAPI;
    practicum_groups?: PracticumGroupAPI[];
    practicum_scheduling_equipments?: PracticumSchedulingEquipmentAPI[];
    practicum_scheduling_materials?: PracticumSchedulingMaterialAPI[];
    kooprodi_approval?: PracticumApprovalAPI;
    kepala_lab_approval?: PracticumApprovalAPI;
    laboran_approval?: PracticumApprovalAPI;
}

export function toDomain(api: PracticumSchedulingAPI): PracticumScheduling {
    console.log(api.practicum_scheduling_equipments ? api.practicum_scheduling_equipments.map(toPracticumSchedulingEquipment) : undefined)
    return new PracticumScheduling(
        api.id,
        api.academic_year_id,
        api.user_id,
        api.ruangan_laboratorium_id,
        api.praktikum_id,
        api.phone_number,
        api.status,
        new Time(api.created_at),
        new Time(api.updated_at),
        api.academicYear ? toAcademicYear(api.academicYear) : undefined,
        api.user ? toUser(api.user) : undefined,
        api.laboratory_room ? toLaboratoryRoom(api.laboratory_room) : undefined,
        api.practicum ? toPracticalWork(api.practicum) : undefined,
        api.practicum_groups ? api.practicum_groups.map(toPracticumGroup) : undefined,
        api.practicum_scheduling_equipments ? api.practicum_scheduling_equipments.map(toPracticumSchedulingEquipment) : undefined,
        api.practicum_scheduling_materials ? api.practicum_scheduling_materials.map(toPracticumSchedulingMaterial) : undefined,
        api.kooprodi_approval ? toPracticumApproval(api.kooprodi_approval) : undefined,
        api.kepala_lab_approval ? toPracticumApproval(api.kepala_lab_approval) : undefined,
        api.laboran_approval ? toPracticumApproval(api.laboran_approval) : undefined,
    );
}