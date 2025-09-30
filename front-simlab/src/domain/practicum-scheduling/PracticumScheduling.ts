import { AcademicYear } from "../academic-year/AcademicYear";
import { LaboratoryRoom } from "../laboratory-room/LaboratoryRoom";
import { PracticalWork } from "../practical-work/Practicum";
import { Time } from "../time/Time";
import { User } from "../User/User";
import { PracticumApproval } from "./PracticumApproval";
import { PracticumGroup } from "./PracticumGroup";
import { PracticumSchedulingEquipment } from "./PracticumSchedulingEquipment";
import { PracticumSchedulingMaterial } from "./PracticumSchedulingMaterial";
import { PracticumSchedulingStatus } from "./PracticumSchedulingStatus";


export class PracticumScheduling {
    constructor(
        readonly id: number,
        readonly academicYearId: number,
        readonly userId: number,
        readonly ruanganLaboratoriumId: number,
        readonly praktikumIid: number,
        readonly phoneNumber: number,
        readonly status: PracticumSchedulingStatus,
        readonly createdAt: Time,
        readonly updatedAt: Time,
        readonly academicYear?: AcademicYear,
        readonly user?: User,
        readonly laboratoryRoom?: LaboratoryRoom,
        readonly practicum?: PracticalWork,
        readonly practicumGroups?: PracticumGroup[],
        readonly practicumSchedulingEquipments?: PracticumSchedulingEquipment[],
        readonly practicumSchedulingMaterials?: PracticumSchedulingMaterial[],
        readonly koorprodiApproval?: PracticumApproval,
        readonly kepalaLabApproval?: PracticumApproval,
        readonly laboranApproval?: PracticumApproval,
    ) {}
}