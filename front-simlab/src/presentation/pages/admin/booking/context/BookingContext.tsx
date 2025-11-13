import { useDepedencies } from "@/presentation/contexts/useDepedencies";
import { ApiResponse } from "@/shared/Types";
import { createContext, useContext, useEffect, useState } from "react";

interface BookingContextType {
    isHasDraftBooking: boolean,
    refreshIsHasDraftBooking: () => void
}

const BookingContext = createContext<BookingContextType | null>(null)

type BookingProps = {
    children: React.ReactNode
}

export const BookingProvider = ({ children }: BookingProps) => {
    const { bookingService } = useDepedencies()
    const [isHasDraftBooking, setIsHasDraftBooking] = useState<boolean>(false)
    const isStillHaveDraftBooking = async () => {
        try {
            const res = await bookingService.isStillHaveDraftBooking()
            if (res.data) {
                setIsHasDraftBooking(true)
            }
        } catch (e) {
            const error = e as ApiResponse
            if (error.code === 404) {
                setIsHasDraftBooking(false)
            }
        }
    }

    useEffect(() => {
        isStillHaveDraftBooking()
    }, [])

    const refreshIsHasDraftBooking = () => isStillHaveDraftBooking
    return (
        <BookingContext.Provider value={{ isHasDraftBooking, refreshIsHasDraftBooking }}>
            {children}
        </BookingContext.Provider>
    )
}

export const useBooking = () => {
    const context = useContext(BookingContext)
    if (!context) throw new Error('useBooking must be used within an authProvider')
    return context
}