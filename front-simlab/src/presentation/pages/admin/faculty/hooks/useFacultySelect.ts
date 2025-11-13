import { FacultySelectView } from "@/application/faculty/FacultySelectView"
import { useDepedencies } from "@/presentation/contexts/useDepedencies"
import { useEffect, useState } from "react"

export const useFacultySelect = () => {
    const { facultyService } = useDepedencies()
    const [faculties, setFaculties] = useState<FacultySelectView[]>([])
    const [selectedFaculty, setSelectedFaculty] = useState<number>(0)

    useEffect(() => {
        const getFaculties = async () => {
            const response = await facultyService.getDataForSelect()
            setFaculties(response.data ?? [])
        }

        getFaculties()
    }, [facultyService])

    return {
        faculties,
        selectedFaculty,
        setSelectedFaculty
    }
}