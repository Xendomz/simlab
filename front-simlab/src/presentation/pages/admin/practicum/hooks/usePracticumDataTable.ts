import useTable from "@/application/hooks/useTable"
import { PracticumView } from "@/application/practicum/PracticumView"
import { useDepedencies } from "@/presentation/contexts/useDepedencies"
import { useDebounce } from "@/presentation/hooks/useDebounce"
import { useCallback, useEffect, useState } from "react"

interface usePracticumDataTableProps {
    filter_study_program: number
}

export const usePracticumDataTable = ({
    filter_study_program
}: usePracticumDataTableProps) => {
    const { practicumService } = useDepedencies()

    const table = useTable()
    const {
        currentPage,
        perPage,
        searchTerm,

        setTotalPages,
        setTotalItems,
        setCurrentPage,
    } = table

    const [practicums, setPracticums] = useState<PracticumView[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const debounceSearchTerm = useDebounce(searchTerm, 500)

    const getData = useCallback(async () => {
        setIsLoading(true)
        const response = await practicumService.getPracticalWorkData({
            page: currentPage,
            per_page: perPage,
            search: searchTerm,
            filter_study_program: filter_study_program
        })
        setPracticums(response.data ?? [])
        setTotalItems(response.total ?? 0)
        setTotalPages(response.last_page ?? 0)
        setIsLoading(false)
    }, [currentPage, perPage, debounceSearchTerm, filter_study_program])

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
        practicums,
        refresh
    }
}