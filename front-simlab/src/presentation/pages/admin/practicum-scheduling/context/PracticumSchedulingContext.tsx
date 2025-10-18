import { useDepedencies } from "@/presentation/contexts/useDepedencies"
import { ApiResponse } from "@/shared/Types"
import { createContext, useContext, useEffect, useState } from "react"

interface PracticumSchedulingContextType {
    isHasDraftPracticum: boolean,
    refreshIsHasDraftPracticum: () => void
}

const PracticumSchedulingContext = createContext<PracticumSchedulingContextType | null>(null)

type PracticumSchedulingProps = {
    children: React.ReactNode
}

export const PracticumSchedulingProvider = ({ children }: PracticumSchedulingProps) => {
    const { practicumSchedulingService } = useDepedencies()
    const [isHasDraftPracticum, setIsHasDraftPracticum] = useState<boolean>(false)
    const isStillHaveDraftPracticum = async () => {
        try {
            const res = await practicumSchedulingService.isStillHaveDraftPracticum()
            if (res.data) {
                setIsHasDraftPracticum(true)
            }
        } catch (e) {
            const error = e as ApiResponse
            if (error.code === 404) {
                setIsHasDraftPracticum(false)
            }                
        }
    }

    useEffect(() => {
        isStillHaveDraftPracticum()
    }, [])

    const refreshIsHasDraftPracticum = () => isStillHaveDraftPracticum

    return (
        <PracticumSchedulingContext.Provider value={{ isHasDraftPracticum, refreshIsHasDraftPracticum }}>
            {children}
        </PracticumSchedulingContext.Provider>
    )
}

export const usePracticumScheduling = () => {
    const context = useContext(PracticumSchedulingContext)
    if (!context) throw new Error('usePracticumScheduling must be used within an authProvider')
    return context
}