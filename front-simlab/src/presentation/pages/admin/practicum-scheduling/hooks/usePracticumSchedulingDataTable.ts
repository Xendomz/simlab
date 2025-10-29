import useTable from "@/application/hooks/useTable"
import { PracticumSchedulingView } from "@/application/practicum-scheduling/PracticumSchedulingView"
import { useDepedencies } from "@/presentation/contexts/useDepedencies"
import { useDebounce } from "@/presentation/hooks/useDebounce"
import { useCallback, useEffect, useState } from "react"

export const usePracticumSchedulingDataTable = () => {
    const { practicumSchedulingService } = useDepedencies()
    const table = useTable()
    const {
        currentPage,
        perPage,
        searchTerm,

        setTotalPages,
        setTotalItems,
        setCurrentPage,
    } = table

    const [practicumSchedulings, setPracticumSchedulings] = useState<PracticumSchedulingView[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const debounceSearchTerm = useDebounce(searchTerm, 500)

    const getData = useCallback(async () => {
        setIsLoading(true)
        const response = await practicumSchedulingService.getPracticumSchedulingData({
            page: currentPage ?? 1,
            per_page: perPage ?? 10,
            search: searchTerm ?? ""
        })

        setPracticumSchedulings(response.data ?? [])
        setTotalPages(response.last_page ?? 0)
        setTotalItems(response.total ?? 0)
        setIsLoading(false)
    }, [])

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
        practicumSchedulings,
        refresh
    }
}