import { useCallback, useMemo, useState } from "react"
import { PracticumSchedulingView } from "../PracticumSchedulingView"
import { PracticumSchedulingService } from "../PracticumSchedulingService"
import { PracticumSchedulingEquipmentNMaterialInputDTO, PracticumSchedulingInputDTO } from "../dto/PracticumSchedulingDTO"

export const usePracticumScheduling = ({
    currentPage,
    perPage,
    searchTerm,
    setTotalPages,
    setTotalItems,
}: {
    currentPage?: number
    perPage?: number
    searchTerm?: string
    setTotalPages?: (v: number) => void
    setTotalItems?: (v: number) => void
}) => {
    const [practicumScheduling, setPracticumScheduling] = useState<PracticumSchedulingView[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isHasDraftPracticum, setIsHasDraftPracticum] = useState(false)

    const service = useMemo(() => new PracticumSchedulingService(), [])

    // const getDataForVerification = useCallback(async () => {
    //     setIsLoading(true)
    //     const response = await service.getBookingsForVerification({
    //         page: currentPage ?? 1,
    //         per_page: perPage ?? 10,
    //         search: searchTerm ?? ""
    //     })

    //     setBooking(response.data ?? [])
    //     if (setTotalPages) setTotalPages(response.last_page ?? 0)
    //     if (setTotalItems) setTotalItems(response.total ?? 0)
    //     setIsLoading(false)
    // }, [currentPage, perPage, searchTerm, service, setTotalPages, setTotalItems])


    const getDataForVerification = useCallback(async () => {
        setIsLoading(true)
        const response = await service.getPracticumSchedulingForVerification({
            page: currentPage ?? 1,
            per_page: perPage ?? 10,
            search: searchTerm ?? ""
        })

        setPracticumScheduling(response.data ?? [])
        if (setTotalPages) setTotalPages(response.last_page ?? 0)
        if (setTotalItems) setTotalItems(response.total ?? 0)
        setIsLoading(false)
    }, [currentPage, perPage, searchTerm, service, setTotalPages, setTotalItems])

    const getData = useCallback(async () => {
        setIsLoading(true)
        const response = await service.getPracticumSchedulingData({
            page: currentPage ?? 1,
            per_page: perPage ?? 10,
            search: searchTerm ?? ""
        })

        setPracticumScheduling(response.data ?? [])
        if (setTotalPages) setTotalPages(response.last_page ?? 0)
        if (setTotalItems) setTotalItems(response.total ?? 0)
        setIsLoading(false)
    }, [currentPage, perPage, searchTerm, service, setTotalPages, setTotalItems])
    const create = (dto: PracticumSchedulingInputDTO) => service.create(dto)

    const getPracticumSchedulingDetail = async (id: number) => {
        return await service.getPracticumSchedulingDetail(id)
    }
    const storePracticumSchedulingEquipmentMaterial = (id: number, dto: PracticumSchedulingEquipmentNMaterialInputDTO) => service.storePracticumSchedulingEquipmentMaterial(id, dto)
    const isStillHaveDraftPracticum = async () => {
        const res = await service.isStillHaveDraftPracticum()
        if (res.data) {
            setIsHasDraftPracticum(true)
        }
    }
    const getPracticumSteps = async (id: number) => service.getPracticumSteps(id)
    // const getReportData = useCallback(async () => {
    //     setIsLoading(true)
    //     const response = await service.getBookingsReport({
    //         page: currentPage ?? 1,
    //         per_page: perPage ?? 10,
    //         search: searchTerm ?? "",
    //         booking_type: bookingType ?? BookingType.Room
    //     })

    //     setBooking(response.data ?? [])
    //     if (setTotalPages) setTotalPages(response.last_page ?? 0)
    //     if (setTotalItems) setTotalItems(response.total ?? 0)
    //     setIsLoading(false)
    // }, [currentPage, perPage, searchTerm, service, setTotalPages, setTotalItems, bookingType])

    // const getBookingDetail = async (id: number) => {
    //     return await service.getBookingDetail(id)
    // }
    // const getBookingApprovals = async (id: number) => service.getBookingApprovals(id)


    // const isStillHaveDraftBooking = async () => {
    //     const res = await service.isStillHaveDraftBooking()
    //     if (res.data) {
    //         setIsHasDraftBooking(true)
    //     }
    // }
    // const storeBookingRoomNEquipment = (id: number, dto: BookingRoomNEquipmentInputDTO) => service.storeBookingRoomNEquipment(id, dto)
    // const storeBookingEquipment = (id: number, equipments: { id: number, quantity: number }[]) => service.storeBookingEquipment(id, equipments)
    // const verifyBooking = async (booking_id: number, data: BookingVerifyDTO): Promise<ApiResponse> => service.verifyBooking(booking_id, data)

    const verify = (id: number, data: { action: 'approve' | 'reject', information?: string, laboran_id?: number, ruangan_laboratorium_id?: number }) => service.verify(id, data)

    return {
        practicumScheduling,
        isLoading,
        getData,
        create,
        getPracticumSchedulingDetail,
        storePracticumSchedulingEquipmentMaterial,
        getDataForVerification,
        verify,
        isHasDraftPracticum,
        isStillHaveDraftPracticum,
        getPracticumSteps
    }
}