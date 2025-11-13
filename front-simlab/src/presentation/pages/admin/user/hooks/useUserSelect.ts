import { UserSelectView } from "@/application/user/UserSelectView"
import { userRole } from "@/domain/User/UserRole"
import { useDepedencies } from "@/presentation/contexts/useDepedencies"
import { useEffect, useState } from "react"

interface useUserSelectProps {
    role: userRole
}

export const useUserSelect = ({role}: useUserSelectProps) => {
    const { userService } = useDepedencies()
    const [users, setUsers] = useState<UserSelectView[]>([])
    const [selectedUser, setSelectedUser] = useState<number>(0)

    useEffect(() => {
        const getUsers = async () => {
            const response = await userService.getDataForSelect(role)
            setUsers(response.data ?? [])
        }

        getUsers()
    }, [userService])

    return {
        users,
        selectedUser,
        setSelectedUser
    }
}