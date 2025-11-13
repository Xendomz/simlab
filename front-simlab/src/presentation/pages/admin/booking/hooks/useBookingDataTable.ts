import { BookingView } from "@/application/booking/BookingView"
import useTable from "@/application/hooks/useTable"
import { useDepedencies } from "@/presentation/contexts/useDepedencies"
import { useDebounce } from "@/presentation/hooks/useDebounce"
import { useCallback, useEffect, useState } from "react"

interface useBookingDataTableProps {
    status: string
}

export const useBookingDataTable = ({
    status
}: useBookingDataTableProps) => {
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
        const response = await bookingService.getBookingData({
            page: currentPage,
            per_page: perPage,
            search: searchTerm,
            filter_status: status
        })
        setBookings(response.data ?? [])
        setTotalItems(response.total ?? 0)
        setTotalPages(response.last_page ?? 0)
        setIsLoading(false)
    }, [currentPage, perPage, debounceSearchTerm, status])

    useEffect(() => {
        getData()
    }, [getData])

    useEffect(() => {
        setCurrentPage(1)
    }, [debounceSearchTerm])

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