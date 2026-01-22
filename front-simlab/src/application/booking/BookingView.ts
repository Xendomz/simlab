import { BookingStatus } from "@/domain/booking/BookingStatus";
import { TimeView } from "../time/TimeView";
import { BookingType } from "@/domain/booking/BookingType";
import { Booking } from "@/domain/booking/Booking";
import { BookingEquipmentView } from "./BookingEquipmentView";
import { BookingMaterialtView } from "./BookingMaterialView";
import { BookingApprovalView } from "./BookingApprovalView";

export class BookingView {
    constructor(
        readonly id: number,
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
        readonly isAllowedOffsite: boolean,
        readonly createdAt: TimeView,
        readonly updatedAt: TimeView,
        readonly bookingEquipments: BookingEquipmentView[],
        readonly bookingMaterials: BookingMaterialtView[],
        readonly bookingApproval: BookingApprovalView[],
        readonly isRequestorCanReturn: boolean,
        readonly academicYear?: string,
        readonly requestor?: {
            name: string,
            email: string
        },
        readonly laboran?: {
            name: string,
            email: string
        },
        readonly laboratoryRoomName?: string,
    ) { }

    static fromDomain(entity: Booking): BookingView {
        return new BookingView(
            entity.id,
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
            entity.isAllowedOffsite,
            TimeView.fromDomain(entity.createdAt),
            TimeView.fromDomain(entity.updatedAt),
            entity.getEquipments().map((eq) => BookingEquipmentView.fromDomain(eq)),
            entity.getMaterials().map((m) => BookingMaterialtView.fromDomain(m)),
            entity.getApprovals().map((ap) => BookingApprovalView.fromDomain(ap)),
            entity.getIsRequestorCanReturn(),
            entity.getAcademicYear(),
            entity.getRequestor(),
            entity.getLaboran(),
            entity.getLaboratoryRoomName(),
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