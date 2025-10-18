import { StudyProgramSelectView } from "@/application/study-program/StudyProgramSelectView"
import { useDepedencies } from "@/presentation/contexts/useDepedencies"
import { useEffect, useState } from "react"

export const useStudyProgramSelect = () => {
    const { studyProgramService } =  useDepedencies()
    const [studyPrograms, setStudyPrograms] = useState<StudyProgramSelectView[]>([])
    const [selectedStudyProgram, setSelectedStudyProgram] = useState<number>(0)

    useEffect(() => {
        const getStudyPrograms = async () => {
            const response = await studyProgramService.getDataForSelect()
            setStudyPrograms(response.data ?? [])
        }

        getStudyPrograms()
    }, [studyProgramService])

    return {
        studyPrograms,
        selectedStudyProgram,
        setSelectedStudyProgram
    }
}