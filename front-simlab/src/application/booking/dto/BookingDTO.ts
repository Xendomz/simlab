import { BookingType } from "@/domain/booking/BookingType";

export interface BookingTableParam {
    page: number,
    per_page: number,
    search: string,
}

export interface BookingReportTableParam {
    page: number,
    per_page: number,
    search: string,
    booking_type: BookingType
}

export interface BookingInputDTO {
    phone_number: string;
    purpose: string;
    supporting_file: string | File | null;
    activity_name: string;
    supervisor: string | null,
    supervisor_email: string | null;
    start_time: Date | undefined;
    end_time: Date | undefined;
    booking_type: string;
    ruangan_laboratorium_id: number | undefined;
    total_participant: number;
    participant_list: string;
}

export interface BookingRoomNEquipmentInputDTO {
    laboratoryEquipments: {
        id: number,
        name: string,
        quantity: number,
        unit: string
    }[];
    laboratoryMaterials: {
        id: number,
        name: string,
        quantity: number,
        unit: string
    }[];
}

export interface BookingVerifyDTO {
    action: 'approve' | 'reject',
    laboran_id?: number,
    information?: string,
    ruangan_laboratorium_id?: number,
    is_allowed_offsite?: boolean | null
}