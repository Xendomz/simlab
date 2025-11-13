import { useCallback, useState } from "react"
import { UserView } from "../UserView"
import { UserService } from "../UserService"
import { UserInputDTO } from "../UserDTO"
import { userRole } from "@/domain/User/UserRole"

export const useUser = ({
    currentPage,
    perPage,
    searchTerm,
    filter_study_program,
    role,
    setTotalPages,
    setTotalItems,
}: {
    currentPage: number
    perPage: number
    searchTerm: string,
    filter_study_program?: number,
    role: userRole,
    setTotalPages: (v: number) => void
    setTotalItems: (v: number) => void
}) => {
    const [user, setUser] = useState<UserView[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const service = new UserService()

    const getData = useCallback(async () => {
        setIsLoading(true)
        const response = await service.getUserData({
            page: currentPage,
            per_page: perPage,
            search: searchTerm,
            filter_study_program: filter_study_program,
            role: role
        })
        setUser(response.data ?? [])
        setTotalPages(response.last_page ?? 0)
        setTotalItems(response.total ?? 0)
        setIsLoading(false)
    }, [currentPage, perPage, searchTerm, filter_study_program, role])

    const create = async (dto: UserInputDTO) => await service.createData(dto)
    const update = async (id: number, dto: UserInputDTO) => await service.updateData(id, dto)
    const remove = async (id: number) => await service.deleteData(id)
    const restoreToDosen = async (id: number) => await service.restoreToDosen(id)

    return {
        user,
        isLoading,
        getData,
        create,
        update,
        remove,
        restoreToDosen
    }
}