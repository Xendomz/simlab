import { PracticumScheduling } from '@/domain/practicum-scheduling/PracticumScheduling';
import { TimeView } from '../time/TimeView';
import { AcademicYearView } from '../academic-year/AcademicYearView';
import { UserView } from '../user/UserView';
import { LaboratoryRoomView } from '../laboratory-room/LaboratoryRoomView';
import { PracticumGroupView } from './PracticumGroupView';
import { PracticumSchedulingEquipmentView } from './PracticumSchedulingEquipmentView';
import { PracticumSchedulingMaterialView } from './PracticumSchedulingMaterialView';
import { PracticumApprovalView } from './PracticumApprovalView';
import { PracticalWorkView } from '../practical-work/PracticalWorkView';

export class PracticumSchedulingView {
    constructor(
        readonly id: number,
        readonly academicYearId: number,
        readonly userId: number,
        readonly laboratoryRoomId: number,
        readonly praktikumId: number,
        readonly phoneNumber: number,
        readonly status: 'draft' | 'submitted',
        readonly createdAt: TimeView,
        readonly updatedAt: TimeView,
        readonly academicYear?: AcademicYearView,
        readonly user?: UserView,
        readonly laboratoryRoom?: LaboratoryRoomView,
        readonly practicum?: PracticalWorkView,
        readonly practicumGroups?: PracticumGroupView[],
        readonly practicumSchedulingEquipments?: PracticumSchedulingEquipmentView[],
        readonly practicumSchedulingMaterials?: PracticumSchedulingMaterialView[],
        readonly koorprodiApproval?: PracticumApprovalView,
        readonly kepalaLabApproval?: PracticumApprovalView,
        readonly laboranApproval?: PracticumApprovalView,
    ) {}

    static fromDomain(entity: PracticumScheduling): PracticumSchedulingView {
        console.log(entity);
        
        return new PracticumSchedulingView(
            entity.id,
            entity.academicYearId,
            entity.userId,
            entity.ruanganLaboratoriumId,
            entity.praktikumIid,
            entity.phoneNumber,
            entity.status,
            TimeView.fromDomain(entity.createdAt),
            TimeView.fromDomain(entity.updatedAt),
            entity.academicYear ? AcademicYearView.fromDomain(entity.academicYear) : undefined,
            entity.user ? UserView.fromDomain(entity.user) : undefined,
            entity.laboratoryRoom ? LaboratoryRoomView.fromDomain(entity.laboratoryRoom) : undefined,
            entity.practicum ? PracticalWorkView.fromDomain(entity.practicum) : undefined,
            entity.practicumGroups ? entity.practicumGroups.map(PracticumGroupView.fromDomain) : undefined,
            entity.practicumSchedulingEquipments ? entity.practicumSchedulingEquipments.map(PracticumSchedulingEquipmentView.fromDomain) : undefined,
            entity.practicumSchedulingMaterials ? entity.practicumSchedulingMaterials.map(PracticumSchedulingMaterialView.fromDomain) : undefined,
            entity.koorprodiApproval ? PracticumApprovalView.fromDomain(entity.koorprodiApproval) : undefined,
            entity.kepalaLabApproval ? PracticumApprovalView.fromDomain(entity.kepalaLabApproval) : undefined,
            entity.laboranApproval ? PracticumApprovalView.fromDomain(entity.laboranApproval) : undefined,
        );
    }
}
