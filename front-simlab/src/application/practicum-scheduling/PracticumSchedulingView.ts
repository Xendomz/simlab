import { PracticumScheduling } from '@/domain/practicum-scheduling/PracticumScheduling';
import { TimeView } from '../time/TimeView';
import { AcademicYearView } from '../academic-year/AcademicYearView';
import { UserView } from '../user/UserView';
import { PracticumSchedulingEquipmentView } from './PracticumSchedulingEquipmentView';
import { PracticumSchedulingMaterialView } from './PracticumSchedulingMaterialView';
import { PracticumApprovalView } from './PracticumApprovalView';
import { PracticumSchedulingStatus } from '@/domain/practicum-scheduling/PracticumSchedulingStatus';
import { PracticumView } from '../practicum/PracticumView';
import { PracticumClassView } from './PracticumClassView';

export class PracticumSchedulingView {
    constructor(
        readonly id: number,
        readonly phoneNumber: number,
        readonly status: PracticumSchedulingStatus,
        readonly createdAt: TimeView,
        readonly updatedAt: TimeView,
        readonly academicYear?: AcademicYearView,
        readonly user?: UserView,
        readonly laboran?: UserView,
        readonly practicum?: PracticumView,
        readonly practicumClasses?: PracticumClassView[],
        readonly practicumSchedulingEquipments?: PracticumSchedulingEquipmentView[],
        readonly practicumSchedulingMaterials?: PracticumSchedulingMaterialView[],
        readonly kepalaLabApproval?: PracticumApprovalView,
        readonly laboranApproval?: PracticumApprovalView,
    ) { }

    static fromDomain(entity: PracticumScheduling): PracticumSchedulingView {
        return new PracticumSchedulingView(
            entity.id,
            entity.phoneNumber,
            entity.status,
            TimeView.fromDomain(entity.createdAt),
            TimeView.fromDomain(entity.updatedAt),
            entity.academicYear ? AcademicYearView.fromDomain(entity.academicYear) : undefined,
            entity.user ? UserView.fromDomain(entity.user) : undefined,
            entity.laboran ? UserView.fromDomain(entity.laboran) : undefined,
            entity.practicum ? PracticumView.fromDomain(entity.practicum) : undefined,
            entity.practicumClasses ? entity.practicumClasses.map(PracticumClassView.fromDomain) : undefined,
            entity.practicumSchedulingEquipments ? entity.practicumSchedulingEquipments.map(PracticumSchedulingEquipmentView.fromDomain) : undefined,
            entity.practicumSchedulingMaterials ? entity.practicumSchedulingMaterials.map(PracticumSchedulingMaterialView.fromDomain) : undefined,
            entity.kepalaLabApproval ? PracticumApprovalView.fromDomain(entity.kepalaLabApproval) : undefined,
            entity.laboranApproval ? PracticumApprovalView.fromDomain(entity.laboranApproval) : undefined,
        );
    }

    getTotalClass(): number {
        return this.practicumClasses?.length || 0
    }
}
