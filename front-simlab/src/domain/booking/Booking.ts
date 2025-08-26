import { AcademicYear } from "../academic-year/AcademicYear";
import { LaboratoryRoom } from "../laboratory-room/LaboratoryRoom";
import { Time } from "../time/Time";
import { User } from "../User/User";
import { BookingApproval } from "./BookingApproval";
import { BookingEquipment } from "./BookingEquipment";
import { BookingMaterial } from "./BookingMaterial";
import { BookingStatus } from "./BookingStatus";
import { BookingType } from "./BookingType";

export class Booking {
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
        readonly startTime: Time,
        readonly endTime: Time,
        readonly status: BookingStatus,
        readonly bookingType: BookingType,
        readonly totalParticipant: number,
        readonly participantList: string,
        readonly createdAt: Time,
        readonly updatedAt: Time,
        readonly kepalaLabApproval?: BookingApproval,
        readonly laboranApproval?: BookingApproval,
        readonly laboratoryRoom?: LaboratoryRoom,
        readonly user?: User,
        readonly academicYear?: AcademicYear,
        readonly bookingEquipment?: BookingEquipment[],
        readonly bookingMaterial?: BookingMaterial[],
    ){}
}