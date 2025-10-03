import { useCallback, useMemo, useState } from "react"
import { BookingView } from "../BookingView"
import { BookingService } from "../BookingService"
import { BookingInputDTO, BookingRoomNEquipmentInputDTO, BookingVerifyDTO } from "../dto/BookingDTO"
import { BookingType } from "@/domain/booking/BookingType"
import { ApiResponse } from "@/shared/Types"

export const useBooking = ({
    currentPage,
    perPage,
    searchTerm,
    setTotalPages,
    setTotalItems,
    bookingType,
    status
}: {
    currentPage?: number
    perPage?: number
    searchTerm?: string
    setTotalPages?: (v: number) => void
    setTotalItems?: (v: number) => void
    bookingType?: BookingType
    status?: string
}) => {
    const [booking, setBooking] = useState<BookingView[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isHasDraftBooking, setIsHasDraftBooking] = useState(false)

    const service = useMemo(() => new BookingService(), [])

    const getDataForVerification = useCallback(async () => {
        setIsLoading(true)
        
        const response = await service.getBookingsForVerification({
            page: currentPage ?? 1,
            per_page: perPage ?? 10,
            search: searchTerm ?? "",
            filter_status: status
        })

        setBooking(response.data ?? [])
        if (setTotalPages) setTotalPages(response.last_page ?? 0)
        if (setTotalItems) setTotalItems(response.total ?? 0)
        setIsLoading(false)
    }, [currentPage, perPage, searchTerm, service, setTotalPages, setTotalItems, status])

    const getData = useCallback(async () => {
        setIsLoading(true)
        const response = await service.getBookingData({
            page: currentPage ?? 1,
            per_page: perPage ?? 10,
            search: searchTerm ?? "",
            filter_status: status
        })

        setBooking(response.data ?? [])
        if (setTotalPages) setTotalPages(response.last_page ?? 0)
        if (setTotalItems) setTotalItems(response.total ?? 0)
        setIsLoading(false)
    }, [currentPage, perPage, searchTerm, service, setTotalPages, setTotalItems, status])

    const getReportData = useCallback(async () => {
        setIsLoading(true)
        const response = await service.getBookingsReport({
            page: currentPage ?? 1,
            per_page: perPage ?? 10,
            search: searchTerm ?? "",
            booking_type: bookingType ?? BookingType.Room
        })

        setBooking(response.data ?? [])
        if (setTotalPages) setTotalPages(response.last_page ?? 0)
        if (setTotalItems) setTotalItems(response.total ?? 0)
        setIsLoading(false)
    }, [currentPage, perPage, searchTerm, service, setTotalPages, setTotalItems, bookingType])

    const getBookingDetail = async (id: number) => {
        return await service.getBookingDetail(id)
    }
    const getBookingSteps = async (id: number) => service.getBookingSteps(id)

    const create = (dto: BookingInputDTO) => service.createData(dto)
    const isStillHaveDraftBooking = async () => {
        const res = await service.isStillHaveDraftBooking()
        if (res.data) {
            setIsHasDraftBooking(true)
        }
    }
    const storeBookingRoomNEquipment = (id: number, dto: BookingRoomNEquipmentInputDTO) => service.storeBookingRoomNEquipment(id, dto)
    const storeBookingEquipment = (id: number, equipments: { id: number, quantity: number }[]) => service.storeBookingEquipment(id, equipments)
    const verifyBooking = async (booking_id: number, data: BookingVerifyDTO): Promise<ApiResponse> => service.verifyBooking(booking_id, data)

    return {
        booking,
        isLoading,
        getData,
        create,
        isStillHaveDraftBooking,
        isHasDraftBooking,
        getBookingDetail,
        storeBookingRoomNEquipment,
        storeBookingEquipment,
        getBookingSteps,
        getDataForVerification,
        getReportData,
        verifyBooking
    }
}