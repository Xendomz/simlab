import { PracticumSchedulingService } from "@/application/practicum-scheduling/PracticumSchedulingService"
import { createContext, useContext, useEffect, useState } from "react"

interface PracticumSchedulingContextType {
    isHasDraftPracticum: boolean,
    changeIsHasDraftPracticum: (status: boolean) => void
}

const PracticumSchedulingContext = createContext<PracticumSchedulingContextType | null>(null)

type PracticumSchedulingProps = {
    children: React.ReactNode
}

export const PracticumSchedulingProvider = ({ children }: PracticumSchedulingProps) => {
    const practicumSchedulingService = new PracticumSchedulingService()
    const [isHasDraftPracticum, setIsHasDraftPracticum] = useState<boolean>(true)

    useEffect(() => {
        const isStillHaveDraftPracticum = async () => {
            const res = await practicumSchedulingService.isStillHaveDraftPracticum()
            if (res.data) {
                setIsHasDraftPracticum(true)
            }
        }

        isStillHaveDraftPracticum()
    }, [])

    const changeIsHasDraftPracticum = (status: boolean) => setIsHasDraftPracticum(status)

    return (
        <PracticumSchedulingContext.Provider value={{ isHasDraftPracticum, changeIsHasDraftPracticum }}>
            {children}
        </PracticumSchedulingContext.Provider>
    )
}

export const usePracticumScheduling = () => {
    const context = useContext(PracticumSchedulingContext)
    if (!context) throw new Error('usePracticumScheduling must be used within an authProvider')
    return context
}