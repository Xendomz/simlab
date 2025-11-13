import { Booking } from "@/domain/booking/Booking";
import { IBookingRepository } from "@/domain/booking/IBookingRepository";
import { ApiResponse, PaginatedResponse } from "@/shared/Types";
import { fetchApi, jsonToFormData } from "../ApiClient";
import { BookingAPI, toDomain } from "./BookingAPI";
import { BookingType } from "@/domain/booking/BookingType";
import { BookingStepperAPI, toDomain as toBookingStepperDomain } from "./BookingStepperAPI";
import { BookingApproval } from "@/domain/booking/BookingApproval";
import { generateQueryStringFromObject } from "../Helper";

export class BookingRepository implements IBookingRepository {
    async getAll(params: { page: number; per_page: number; search: string; filter_status?: string; }): Promise<PaginatedResponse<Booking>> {
        const queryString = generateQueryStringFromObject(params);
        const response = await fetchApi(`/bookings?${queryString}`, { method: 'GET' })
        const json = await response.json()
        if (response.ok) {
            const data = json['data'] as PaginatedResponse<BookingAPI>

            return {
                ...data,
                data: data.data?.map(toDomain) || []
            }
        }
        throw json['message']
    }

    async getBookingsForVerification(params: { page: number; per_page: number; search: string; filter_status?: string; }): Promise<PaginatedResponse<Booking>> {
        const queryString = generateQueryStringFromObject(params);
        const response = await fetchApi(`/bookings/verification?${queryString}`, { method: 'GET' });
        const json = await response.json();
        if (response.ok) {
            const data = json['data'] as PaginatedResponse<BookingAPI>;
            return {
                ...data,
                data: data.data?.map(toDomain) || []
            };
        }
        throw json['message'];
    }

    async getBookingsReport(params: { page: number; per_page: number; search: string; booking_type: BookingType }): Promise<PaginatedResponse<Booking>> {
        const queryString = new URLSearchParams(
            Object.entries(params).reduce((acc, [key, value]) => {
                acc[key] = String(value);
                return acc;
            }, {} as Record<string, string>)
        ).toString();

        const response = await fetchApi(`/bookings-report?${queryString}`, { method: 'GET' })
        const json = await response.json()
        if (response.ok) {
            const data = json['data'] as PaginatedResponse<BookingAPI>

            return {
                ...data,
                data: data.data?.map(toDomain) || []
            }
        }
        throw json['message']
    }

    async createData(data: { phone_number: string, purpose: string, supporting_file: string | File | null, activity_name: string, supervisor: string | null, supervisor_email: string | null, start_time: Date | undefined, end_time: Date | undefined, booking_type: string }): Promise<ApiResponse<Booking>> {
        const formattedData = {
            ...data,
            start_time: data.start_time ? data.start_time.toISOString() : undefined,
            end_time: data.end_time ? data.end_time.toISOString() : undefined,
        }
        const bodyFormData = jsonToFormData(formattedData, 'POST')
        const response = await fetchApi(`/bookings`, {
            method: 'POST',
            body: bodyFormData
        });

        const json = await response.json() as ApiResponse
        if (response.ok) {
            return {
                ...json,
                data: toDomain(json.data)
            }
        }
        throw json
    }

    async isStillHaveDraftBooking(): Promise<ApiResponse<boolean>> {
        const response = await fetchApi(`/bookings/have-draft`, {
            method: 'GET',
        });

        const json = await response.json()
        if (response.ok) {
            return json
        }

        throw json
    }

    async getBookingData(id:number): Promise<ApiResponse<Booking>> {
        const response = await fetchApi(`/bookings/${id}/detail`, {
            method: 'GET'
        });

        const json = await response.json()
        if (response.ok) {
            const data = json['data'] as BookingAPI
            
            return {
                ...json,
                data: toDomain(data)
            }
        }
        throw json
    }

    async getBookingApprovals(id: number): Promise<ApiResponse<BookingApproval[]>> {
        const response = await fetchApi(`/bookings/${id}/approvals`, { method: 'GET' });
        const json = await response.json();
        if (response.ok) {
            const list = json['data'] as BookingStepperAPI[];
            return {
                ...json,
                data: list?.map(toBookingStepperDomain) || []
            }
        }
        throw json;
    }

    async storeBookingEquipmentMaterial(id: number, data: { laboratoryEquipments: { id: number; quantity: number; }[]; laboratoryMaterials: { id: number; quantity: number; }[]; }): Promise<ApiResponse> {
        // Transform to backend expected payload (strip name/unit if present before calling service; service will pass reduced objects)
        const response = await fetchApi(`/bookings/${id}/equipment-material`, {
            method: 'POST',
            body: JSON.stringify(data)
        })

        const json = await response.json()
        if (response.ok) {
            return json
        }
        throw json
    }

    async storeBookingEquipment(id: number, data: { laboratoryEquipments: { id: number; quantity: number; }[]; }): Promise<ApiResponse> {
        const response = await fetchApi(`/bookings/${id}/equipment`, {
            method: 'POST',
            body: JSON.stringify(data)
        })
        const json = await response.json()
        if (response.ok) {
            return json
        }
        throw json
    }

    async verifyBooking(booking_id: number, data: { action: "approve" | "reject" | "revision"; laboran_id?: number; information?: string; laboratory_room_id?: number | null; is_allowed_offsite?: boolean }): Promise<ApiResponse> {

        const response = await fetchApi(`/bookings/${booking_id}/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const json = await response.json();
        if (response.ok) {
            return json
        }
        throw json;
    }

    async verifyBookingReturn(booking_id: number, information: string): Promise<ApiResponse> {
        const response = await fetchApi(`/bookings/${booking_id}/verify-return`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({information: information})
        });
        
        const json = await response.json();
        if (response.ok) {
            return json
        }
        throw json;
    }
}