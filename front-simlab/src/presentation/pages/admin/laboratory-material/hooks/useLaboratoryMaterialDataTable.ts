import useTable from "@/application/hooks/useTable"
import { LaboratoryMaterialView } from "@/application/laboratory-material/LaboratoryMaterialView"
import { useDepedencies } from "@/presentation/contexts/useDepedencies"
import { useDebounce } from "@/presentation/hooks/useDebounce"
import { useCallback, useEffect, useState } from "react"

interface useLaboratoryMaterialDataTableProps {
    filter_laboratory_room: number
}

export const useLaboratoryMaterialDataTable = ({
    filter_laboratory_room
}: useLaboratoryMaterialDataTableProps) => {
    const { laboratoryMaterialService } = useDepedencies()

    const table = useTable()
    const {
        currentPage,
        perPage,
        searchTerm,

        setTotalPages,
        setTotalItems,
        setCurrentPage,
    } = table

    const [laboratoryMaterials, setLaboratoryMaterials] = useState<LaboratoryMaterialView[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const debounceSearchTerm = useDebounce(searchTerm, 500)

    const getData = useCallback(async () => {
        setIsLoading(true)
        const response = await laboratoryMaterialService.getLaboratoryMaterialData({
            page: currentPage,
            per_page: perPage,
            search: searchTerm,
            filter_laboratory_room: filter_laboratory_room
        })

        setLaboratoryMaterials(response.data ?? [])
        setTotalItems(response.total ?? 0)
        setTotalPages(response.last_page ?? 0)
        setIsLoading(false)
    }, [currentPage, perPage, debounceSearchTerm, filter_laboratory_room])

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
        laboratoryMaterials,
        refresh
    }
}