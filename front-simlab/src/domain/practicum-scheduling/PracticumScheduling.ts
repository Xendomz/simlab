import { AcademicYear } from "../academic-year/AcademicYear";
import { Practicum } from "../practicum/Practicum";
import { Time } from "../time/Time";
import { User } from "../User/User";
import { PracticumApproval } from "./PracticumApproval";
import { PracticumClass } from "./PracticumClass";
import { PracticumSchedulingEquipment } from "./PracticumSchedulingEquipment";
import { PracticumSchedulingMaterial } from "./PracticumSchedulingMaterial";
import { PracticumSchedulingStatus } from "./PracticumSchedulingStatus";


export class PracticumScheduling {
    constructor(
        readonly id: number,
        readonly phoneNumber: number,
        readonly status: PracticumSchedulingStatus,
        readonly createdAt: Time,
        readonly updatedAt: Time,
        readonly academicYear?: AcademicYear,
        readonly user?: User,
        readonly laboran?: User,
        readonly practicum?: Practicum,
        readonly practicumClasses?: PracticumClass[],
        readonly practicumSchedulingEquipments?: PracticumSchedulingEquipment[],
        readonly practicumSchedulingMaterials?: PracticumSchedulingMaterial[],
        readonly kepalaLabApproval?: PracticumApproval,
        readonly laboranApproval?: PracticumApproval,
    ) {}
}