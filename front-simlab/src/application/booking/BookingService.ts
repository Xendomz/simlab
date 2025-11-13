import { BookingRepository } from "@/infrastructure/booking/BookingRepository";
import { BookingInputDTO, BookingReportTableParam, BookingRoomNEquipmentInputDTO, BookingTableParam, BookingVerifyDTO } from "./dto/BookingDTO";
import { ApiResponse, PaginatedResponse } from "@/shared/Types";
import { BookingView } from "./BookingView";
import { BookingApprovalView } from "./BookingApprovalView";

export class BookingService {
    private readonly bookingRepository = new BookingRepository()

    async getBookingsForVerification(params: BookingTableParam): Promise<PaginatedResponse<BookingView>> {
        const bookings = await this.bookingRepository.getBookingsForVerification(params);
        return {
            ...bookings,
            data: bookings.data.map(BookingView.fromDomain) || []
        };
    }

    async getBookingData(params: BookingTableParam): Promise<PaginatedResponse<BookingView>> {
        const bookings = await this.bookingRepository.getAll(params)

        return {
            ...bookings,
            data: bookings.data.map(BookingView.fromDomain) || []
        }
    }

    async getBookingsReport(params: BookingReportTableParam): Promise<PaginatedResponse<BookingView>> {
        const bookings = await this.bookingRepository.getBookingsReport(params)

        return {
            ...bookings,
            data: bookings.data.map(BookingView.fromDomain) || []
        }
    }

    async createData(data: BookingInputDTO): Promise<ApiResponse<BookingView>> {
        const booking = await this.bookingRepository.createData(data)

        return {
            ...booking,
            data: booking.data ? BookingView.fromDomain(booking.data) : undefined
        }
    }

    async isStillHaveDraftBooking(): Promise<ApiResponse> {
        return await this.bookingRepository.isStillHaveDraftBooking()
    }

    async getBookingDetail(id: number): Promise<ApiResponse<BookingView>> {
        const booking = await this.bookingRepository.getBookingData(id)
        
        return {
            ...booking,
            data: booking.data ? BookingView.fromDomain(booking.data) : undefined
        }
    }

    async getBookingApprovals(id: number): Promise<ApiResponse<BookingApprovalView[]>> {
        const response = await this.bookingRepository.getBookingApprovals(id);
        return {
            ...response,
            data: response.data ? response.data.map(BookingApprovalView.fromDomain) : []
        };
    }

    async storeBookingEquipmentMaterial(id: number, data: BookingRoomNEquipmentInputDTO): Promise<ApiResponse> {
        // Reduce payload to only needed fields for equipments/materials
        const payload = {
            laboratoryEquipments: data.laboratoryEquipments.map(e => ({ id: e.id, quantity: e.quantity })),
            laboratoryMaterials: data.laboratoryMaterials.map(m => ({ id: m.id, quantity: m.quantity })),
        }

        return await this.bookingRepository.storeBookingEquipmentMaterial(id, payload)
    }

    async storeBookingEquipment(id: number, equipments: { id: number, quantity: number }[]): Promise<ApiResponse> {
        return await this.bookingRepository.storeBookingEquipment(id, { laboratoryEquipments: equipments })
    }

    async verifyBooking(booking_id: number, data: BookingVerifyDTO): Promise<ApiResponse> {
        return await this.bookingRepository.verifyBooking(booking_id, data);
    }

    async verifyBookingReturn(booking_id: number, information: string): Promise<ApiResponse> {
        return await this.bookingRepository.verifyBookingReturn(booking_id, information)
    }
}