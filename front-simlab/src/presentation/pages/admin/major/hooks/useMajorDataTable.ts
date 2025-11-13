import useTable from "@/application/hooks/useTable"
import { MajorView } from "@/application/major/MajorView"
import { useDepedencies } from "@/presentation/contexts/useDepedencies"
import { useDebounce } from "@/presentation/hooks/useDebounce"
import { useCallback, useEffect, useState } from "react"

interface useMajorDataTableProps {
    filter_faculty: number
}

export const useMajorDataTable = ({
    filter_faculty
}: useMajorDataTableProps) => {
    const { majorService } = useDepedencies()

    const table = useTable()
    const {
        currentPage,
        perPage,
        searchTerm,

        setTotalPages,
        setTotalItems,
        setCurrentPage,
    } = table

    const [majors, setMajors] = useState<MajorView[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const debounceSearchTerm = useDebounce(searchTerm, 500)

    const getData = useCallback(async () => {
        setIsLoading(true)
        const response = await majorService.getMajorData({
            page: currentPage,
            per_page: perPage,
            search: searchTerm,
            filter_faculty: filter_faculty
        });
        setMajors(response.data ?? [])
        setTotalItems(response.total ?? 0)
        setTotalPages(response.last_page ?? 0)
        setIsLoading(false)
    }, [currentPage, perPage, debounceSearchTerm, filter_faculty])

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
        majors,
        refresh
    }
}