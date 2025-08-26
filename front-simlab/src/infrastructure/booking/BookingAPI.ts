import { Booking } from "@/domain/booking/Booking";
import { BookingStatus } from "@/domain/booking/BookingStatus";
import { BookingType } from "@/domain/booking/BookingType";
import { Time } from "@/domain/time/Time";
import { UserApi, toDomain as toUser } from "../user/UserApi";
import { BookingEquipmentAPI, toDomain as toBookingEquipment } from "./BookingEquipmentAPI";
import { BookingMaterialAPI, toDomain as toBookingMaterial } from "./BookingMaterialAPI";
import { AcademicYearAPI, toDomain as toAcademicYear } from "../academic-year/AcademicYearAPI";
import { LaboratoryRoomAPI, toDomain as toLaboratoryRoom } from "../laboratory-room/LaboratoryRoomAPI";
import { BookingApprovalAPI, toDomain as toBookingApproval } from "./BookingApprovalAPI";

export type BookingAPI = {
    id: number;
    academic_year_id: number;
    user_id: number;
    ruangan_laboratorium_id: number | null;
    phone_number: string;
    purpose: string;
    supporting_file: string | null;
    activity_name: string;
    supervisor: string | null,
    supervisor_email: string | null;
    start_time: string;
    end_time: string;
    status: string;
    booking_type: string;
    total_participant: number;
    participant_list: string;
    created_at: string;
    updated_at: string;
    kepala_lab_approval?: BookingApprovalAPI
    laboran_approval?: BookingApprovalAPI
    laboratory_room?: LaboratoryRoomAPI;
    user?: UserApi,
    academic_year?: AcademicYearAPI,
    equipments?: BookingEquipmentAPI[],
    materials?: BookingMaterialAPI[]
}

export function toDomain(api: BookingAPI): Booking {
    return new Booking(
        api.id,
        api.academic_year_id,
        api.user_id,
        api.ruangan_laboratorium_id,
        api.phone_number,
        api.purpose,
        api.supporting_file,
        api.activity_name,
        api.supervisor,
        api.supervisor_email,
        new Time(api.start_time),
        new Time(api.end_time),
        api.status as BookingStatus,
        api.booking_type as BookingType,
        api.total_participant,
        api.participant_list,
        new Time(api.created_at),
        new Time(api.updated_at),
        api.kepala_lab_approval ? toBookingApproval(api.kepala_lab_approval) : undefined,
        api.laboran_approval ? toBookingApproval(api.laboran_approval) : undefined,
        api.laboratory_room ? toLaboratoryRoom(api.laboratory_room) : undefined,
        api.user ? toUser(api.user) : undefined,
        api.academic_year ? toAcademicYear(api.academic_year) : undefined,
        api.equipments ? api.equipments.map(toBookingEquipment) : undefined,
        api.materials ? api.materials.map(toBookingMaterial) : undefined
    )
}