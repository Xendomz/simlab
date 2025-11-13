import useTable from "@/application/hooks/useTable"
import { LaboratoryRoomView } from "@/application/laboratory-room/LaboratoryRoomView"
import { useDepedencies } from "@/presentation/contexts/useDepedencies"
import { useDebounce } from "@/presentation/hooks/useDebounce"
import { useCallback, useEffect, useState } from "react"

export const useLaboratoryRoomDataTable = () => {
    const { laboratoryRoomService } = useDepedencies()

    const table = useTable()
    const {
        currentPage,
        perPage,
        searchTerm,

        setTotalPages,
        setTotalItems,
        setCurrentPage,
    } = table

    const [laboratoryRooms, setLaboratoryRooms] = useState<LaboratoryRoomView[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const debounceSearchTerm = useDebounce(searchTerm, 500)

    const getData = useCallback(async () => {
        setIsLoading(true)
        const response = await laboratoryRoomService.getLaboratoryRoomData({
            page: currentPage,
            per_page: perPage,
            search: searchTerm,
        })
        setLaboratoryRooms(response.data ?? [])
        setTotalItems(response.total ?? 0)
        setTotalPages(response.last_page ?? 0)
        setIsLoading(false)
    }, [currentPage, perPage, debounceSearchTerm])

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
        laboratoryRooms,
        refresh
    }

}