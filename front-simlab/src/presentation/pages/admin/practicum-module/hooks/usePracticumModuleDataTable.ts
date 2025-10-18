import useTable from "@/application/hooks/useTable"
import { PracticumModuleView } from "@/application/practicum-module/PracticumModuleView"
import { useDepedencies } from "@/presentation/contexts/useDepedencies"
import { useDebounce } from "@/presentation/hooks/useDebounce"
import { useCallback, useEffect, useState } from "react"

interface usePracticumModuleDataTableProps {
    filter_practicum: number
}

export const usePracticumModuleDataTable = ({ filter_practicum }: usePracticumModuleDataTableProps) => {
    const { practicumModuleService } = useDepedencies()
    const table = useTable()
    const {
        currentPage,
        perPage,
        searchTerm,

        setTotalPages,
        setTotalItems,
        setCurrentPage,
    } = table

    const [practicumModules, setPracticumModules] = useState<PracticumModuleView[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const debounceSearchTerm = useDebounce(searchTerm, 500)

    const getData = useCallback(async () => {
        setIsLoading(true)
        const response = await practicumModuleService.getPracticumModuleData({
            page: currentPage,
            per_page: perPage,
            search: searchTerm,
            filter_practicum: filter_practicum
        })
        setPracticumModules(response.data ?? [])
        setTotalItems(response.total ?? 0)
        setTotalPages(response.last_page ?? 0)
        setIsLoading(false)
    }, [currentPage, perPage, debounceSearchTerm, filter_practicum])

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
        practicumModules,
        refresh
    }
}