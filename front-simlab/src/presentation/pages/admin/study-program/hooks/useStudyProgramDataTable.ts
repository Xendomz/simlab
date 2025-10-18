import useTable from "@/application/hooks/useTable"
import { StudyProgramView } from "@/application/study-program/StudyProgramView"
import { useDepedencies } from "@/presentation/contexts/useDepedencies"
import { useDebounce } from "@/presentation/hooks/useDebounce"
import { useCallback, useEffect, useState } from "react"

interface useStudyProgramDataTableParams {
    filter_major: number
}

export const useStudyProgramDataTable = ({
    filter_major
}: useStudyProgramDataTableParams) => {
    const { studyProgramService } = useDepedencies()
    const table = useTable()
    const {
        currentPage,
        perPage,
        searchTerm,

        setTotalPages,
        setTotalItems,
        setCurrentPage,
    } = table

    const [studyPrograms, setStudyPrograms] = useState<StudyProgramView[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const debounceSearchTerm = useDebounce(searchTerm, 500)

    const getData = useCallback(async () => {
        setIsLoading(true)
        const response = await studyProgramService.getStudyProgramData({
            page: currentPage,
            per_page: perPage,
            search: searchTerm,
            filter_major: filter_major
        })
        setStudyPrograms(response.data ?? [])
        setTotalItems(response.total ?? 0)
        setTotalPages(response.last_page ?? 0)
        setIsLoading(false)
    }, [currentPage, perPage, filter_major, debounceSearchTerm])

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
        studyPrograms,
        refresh
    }
}