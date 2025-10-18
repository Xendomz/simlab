import { MajorSelectView } from "@/application/major/MajorSelectView"
import { useDepedencies } from "@/presentation/contexts/useDepedencies"
import { useEffect, useState } from "react"

export const useMajorSelect = () => {
    const { majorService } = useDepedencies()
    const [majors, setMajors] = useState<MajorSelectView[]>([])
    const [selectedMajor, setSelectedMajor] = useState<number>(0)

    useEffect(() => {
        const getMajors = async () => {
            const response = await majorService.getDataForSelect()
            setMajors(response.data ?? [])
        }

        getMajors()
    }, [majorService])

    return {
        majors,
        selectedMajor,
        setSelectedMajor
    }
}