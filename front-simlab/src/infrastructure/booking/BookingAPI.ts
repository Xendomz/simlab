import { Booking } from "@/domain/booking/Booking";
import { BookingStatus } from "@/domain/booking/BookingStatus";
import { BookingType } from "@/domain/booking/BookingType";
import { Time } from "@/domain/time/Time";
import { BookingEquipmentAPI, toDomain as toBookingEquipment } from "./BookingEquipmentAPI";
import { BookingMaterialAPI, toDomain as toBookingMaterial } from "./BookingMaterialAPI";
import { BookingApprovalAPI, toDomain as toBookingApproval } from "./BookingApprovalAPI";

export type BookingAPI = {
    id: number;
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
    is_allowed_offsite: number
    created_at: string;
    updated_at: string;
    academic_year: string,
    requestor: {
        name: string,
        email: string
    };
    laboran: {
        name: string,
        email: string
    };
    laboratory_room_name: string
    booking_equipments: BookingEquipmentAPI[];
    booking_materials: BookingMaterialAPI[];
    approvals: BookingApprovalAPI[];
}

export function toDomain(api: BookingAPI): Booking {
    const booking = new Booking(
        api.id,
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
        Boolean(api.is_allowed_offsite),
        new Time(api.created_at),
        new Time(api.updated_at)
    );

    if (api.laboratory_room_name) {
        booking.setLaboratoryRoomName(api.laboratory_room_name);
    }

    if (api.requestor) {
        booking.setRequestor(api.requestor);
    }

    if (api.laboran) {
        booking.setLaboran(api.laboran);
    }

    if (api.academic_year) {
        booking.setAcademicYearLabel(api.academic_year);
    }

    if (api.booking_equipments?.length) {
        const equipments = api.booking_equipments.map(
            (equipment) => toBookingEquipment(equipment)
        );
        booking.setBookingEquipments(equipments);
    }

    if (api.booking_materials?.length) {
        const materials = api.booking_materials.map(
            (material) => toBookingMaterial(material)
        );
        booking.setBookingMaterial(materials);
    }

    if (api.approvals?.length) {
        const approvals = api.approvals.map(
            (approval) => toBookingApproval(approval)
        )
        booking.setBookingApproval(approvals)
    }

    return booking;
}