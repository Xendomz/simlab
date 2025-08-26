import { BookingStatus } from "@/domain/booking/BookingStatus";
import { TimeView } from "../time/TimeView";
import { BookingType } from "@/domain/booking/BookingType";
import { Booking } from "@/domain/booking/Booking";
import { UserView } from "../user/UserView";
import { BookingEquipmentView } from "./BookingEquipmentView";
import { BookingMaterialtView } from "./BookingMaterialView";
import { AcademicYearView } from "../academic-year/AcademicYearView";
import { LaboratoryRoomView } from "../laboratory-room/LaboratoryRoomView";
import { BookingApprovalView } from "./BookingApprovalView";

export class BookingView {
    constructor(
        readonly id: number,
        readonly academicYearId: number,
        readonly userId: number,
        readonly laboratoryRoomId: number | null,
        readonly phoneNumber: string,
        readonly purpose: string,
        readonly supportingFile: string | null,
        readonly activityName: string,
        readonly supervisor: string | null,
        readonly supervisorEmail: string | null,
        readonly startTime: TimeView,
        readonly endTime: TimeView,
        readonly status: BookingStatus,
        readonly bookingType: BookingType,
        readonly totalParticipant: number,
        readonly participantList: string,
        readonly createdAt: TimeView,
        readonly updatedAt: TimeView,
        readonly kepalaLabApproval?: BookingApprovalView,
        readonly laboranApproval?: BookingApprovalView,
        readonly laboratoryRoom?: LaboratoryRoomView,
        readonly user?: UserView,
        readonly academicYear?: AcademicYearView,
        readonly bookingEquipment?: BookingEquipmentView[],
        readonly bookingMaterial?: BookingMaterialtView[],
    ) { }

    static fromDomain(entity: Booking): BookingView {
        return new BookingView(
            entity.id,
            entity.academicYearId,
            entity.userId,
            entity.laboratoryRoomId,
            entity.phoneNumber,
            entity.purpose,
            entity.supportingFile,
            entity.activityName,
            entity.supervisor,
            entity.supervisorEmail,
            TimeView.fromDomain(entity.startTime),
            TimeView.fromDomain(entity.endTime),
            entity.status,
            entity.bookingType,
            entity.totalParticipant,
            entity.participantList,
            TimeView.fromDomain(entity.createdAt),
            TimeView.fromDomain(entity.updatedAt),
            entity.kepalaLabApproval ? BookingApprovalView.fromDomain(entity.kepalaLabApproval) : undefined,
            entity.laboranApproval ? BookingApprovalView.fromDomain(entity.laboranApproval) : undefined,
            entity.laboratoryRoom ? LaboratoryRoomView.fromDomain(entity.laboratoryRoom) : undefined,
            entity.user ? UserView.fromDomain(entity.user) : undefined,
            entity.academicYear ? AcademicYearView.fromDomain(entity.academicYear) : undefined,
            entity.bookingEquipment ? entity.bookingEquipment.map(BookingEquipmentView.fromDomain) : undefined,
            entity.bookingMaterial ? entity.bookingMaterial.map(BookingMaterialtView.fromDomain) : undefined,
        )
    }

    getFormattedBookingType(): string {
        switch (this.bookingType) {
            case BookingType.Room:
                return 'Peminjaman Ruangan'

            case BookingType.RoomNEquipment:
                return 'Peminjaman Ruangan dan Alat'

            case BookingType.Equipment:
                return 'Peminjaman Alat'

            default:
                return 'N/a'
        }
    }
}