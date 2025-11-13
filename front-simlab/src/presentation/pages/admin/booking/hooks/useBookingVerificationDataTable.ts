import { BookingView } from "@/application/booking/BookingView"
import useTable from "@/application/hooks/useTable"
import { useDepedencies } from "@/presentation/contexts/useDepedencies"
import { useDebounce } from "@/presentation/hooks/useDebounce"
import { useCallback, useEffect, useState } from "react"

interface useBookingVerificationDataTableProps {
    filter_status: string
}

export const useBookingVerificationDataTable = ({
    filter_status
}: useBookingVerificationDataTableProps) => {
    const { bookingService } = useDepedencies()
    const table = useTable()
    const {
        currentPage,
        perPage,
        searchTerm,

        setTotalPages,
        setTotalItems,
        setCurrentPage,
    } = table

    const [bookings, setBookings] = useState<BookingView[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const debounceSearchTerm = useDebounce(searchTerm, 500)

    const getData = useCallback(async () => {
        setIsLoading(true)
        const response = await bookingService.getBookingsForVerification({
            page: currentPage ?? 1,
            per_page: perPage ?? 10,
            search: searchTerm ?? "",
            filter_status: filter_status
        })

        setBookings(response.data ?? [])
        setTotalPages(response.last_page ?? 0)
        setTotalItems(response.total ?? 0)
        setIsLoading(false)
    }, [currentPage, perPage, searchTerm, filter_status, setTotalPages, setTotalItems])

    useEffect(() => {
        getData();
    }, [getData]);

    useEffect(() => {
        setCurrentPage(1);
    }, [debounceSearchTerm]);

    const refresh = useCallback(() => {
        getData()
    }, [getData])

    return {
        ...table,
        isLoading,
        bookings,
        refresh
    }
}