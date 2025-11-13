import { LaboratoryRoomSelectView } from "@/application/laboratory-room/LaboratoryRoomSelectView"
import { useDepedencies } from "@/presentation/contexts/useDepedencies"
import { useEffect, useState } from "react"

export const useLaboratoryRoomSelect = () => {
    const { laboratoryRoomService } = useDepedencies()
    const [laboratoryRooms, setLaboratoryRooms] = useState<LaboratoryRoomSelectView[]>([])
    const [selectedLaboratoryRoom, setSelectedLaboratoryRoom] = useState<number>(0)

    useEffect(() => {
        const getLaboratoryRooms = async () => {
            const response = await laboratoryRoomService.getDataForSelect()
            setLaboratoryRooms(response.data ?? [])
        }

        getLaboratoryRooms()
    }, [laboratoryRoomService])

    return {
        laboratoryRooms,
        selectedLaboratoryRoom,
        setSelectedLaboratoryRoom
    }
}