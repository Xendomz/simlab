import { useCallback, useState } from "react"
import { PracticalWorkView } from "../PracticalWorkView"
import { PracticalWorkService } from "../PracticalWorkService"
import { PracticalWorkInputDTO } from "../dto/PracticalWorkDTO"

export const usePracticalWork = ({
    currentPage,
    perPage,
    searchTerm,
    setTotalPages,
    setTotalItems,
    filter_study_program
}: {
    currentPage: number
    perPage: number
    searchTerm: string,
    filter_study_program?: number
    setTotalPages: (v: number) => void
    setTotalItems: (v: number) => void
}) => {
    const [practicalWork, setPracticalWork] = useState<PracticalWorkView[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const service = new PracticalWorkService()

    const getData = useCallback(async () => {
        setIsLoading(true)
        const response = await service.getPracticalWorkData({
            page: currentPage,
            per_page: perPage,
            search: searchTerm,
            filter_study_program: filter_study_program
        })
        setPracticalWork(response.data ?? [])
        setTotalPages(response.last_page ?? 0)
        setTotalItems(response.total ?? 0)
        setIsLoading(false)
    }, [currentPage, perPage, searchTerm, filter_study_program])

    const create = (dto: PracticalWorkInputDTO) => service.createData(dto)
    const update = (id: number, dto: PracticalWorkInputDTO) => service.updateData(id, dto)
    const remove = (id: number) => service.deleteData(id)

    return {
        practicalWork,
        isLoading,
        getData,
        create,
        update,
        remove
    }
}