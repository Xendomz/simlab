import { ApiResponse, PaginatedResponse } from "@/shared/Types";
import { Booking } from "./Booking";
import { BookingType } from "./BookingType";
import { BookingStepper } from "./BookingStepper";

export interface IBookingRepository {
    getAll(params: {
        page: number,
        per_page: number,
        search: string,
        filter_status?: string
    }): Promise<PaginatedResponse<Booking>>

    getBookingsForVerification(params: {
        page: number,
        per_page: number,
        search: string,
        filter_status?: string
    }): Promise<PaginatedResponse<Booking>>

    getBookingsReport(params: {
        page: number,
        per_page: number,
        search: string,
        booking_type: BookingType
    }): Promise<PaginatedResponse<Booking>>

    createData(data: {
        phone_number: string;
        purpose: string;
        supporting_file: string | null;
        activity_name: string;
        supervisor: string | null,
        supervisor_email: string | null;
        start_time: Date | undefined;
        end_time: Date | undefined;
        booking_type: string;
    }): Promise<ApiResponse<Booking>>

    isStillHaveDraftBooking(): Promise<ApiResponse<boolean>>

    getBookingData(id: number): Promise<ApiResponse<Booking>>
    getBookingSteps(id: number): Promise<ApiResponse<BookingStepper[]>>

    storeBookingRoomNEquipment(id: number, data: {
        laboratoryEquipments: { id: number, quantity: number }[],
        laboratoryMaterials: { id: number, quantity: number }[],
    }): Promise<ApiResponse>

    storeBookingEquipment(id: number, data: {
        laboratoryEquipments: { id: number, quantity: number }[]
    }): Promise<ApiResponse>

    verifyBooking(
        booking_id: number,
        data: {
            action: 'approve' | 'reject' | 'revision',
            laboran_id?: number,
            information?: string,
            laboratory_room_id?: number,
            is_allowed_offsite?: boolean | null
        }
    ): Promise<ApiResponse>;
}