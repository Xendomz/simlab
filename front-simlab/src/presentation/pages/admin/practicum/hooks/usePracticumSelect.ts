import { PracticumSelectView } from "@/application/practicum/PracticumSelectView"
import { useDepedencies } from "@/presentation/contexts/useDepedencies"
import { useEffect, useState } from "react"

export const usePracticumSelect = () => {
    const { practicumService } = useDepedencies()
    const [practicums, setPracticums] = useState<PracticumSelectView[]>([])
    const [selectedPracticum, setSelectedPracticum] = useState<number>(0)

    useEffect(() => {
        const getPracticums = async () => {
            const response = await practicumService.getDataForSelect()
            setPracticums(response.data ?? [])
        }

        getPracticums()
    }, [practicumService])

    return {
        practicums,
        selectedPracticum,
        setSelectedPracticum
    }
}