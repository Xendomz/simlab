import { BookingInputDTO } from "@/application/booking/dto/BookingDTO"
import { useState } from "react"

export const useBookingForm = () => {
    const [formData, setFormData] = useState<BookingInputDTO>({
        phone_number: '',
        purpose: '',
        supporting_file: null,
        activity_name: '',
        supervisor: null,
        supervisor_email: null,
        start_time: undefined,
        end_time: undefined,
        booking_type: '',
        laboratory_room_id: null,
        total_participant: 0,
        participant_list: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'supporting_file' && (e.target as HTMLInputElement).files) {
            setFormData((prev) => ({ ...prev, supporting_file: (e.target as HTMLInputElement).files ? (e.target as HTMLInputElement).files![0] : null }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

    };

    const handleDateTimeChange = (e: { target: { name: "start_time" | "end_time"; value: Date } }) => {
        const { name, value } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return {
        formData,
        setFormData,
        handleChange,
        handleDateTimeChange
    }
}