import { useDepedencies } from "@/presentation/contexts/useDepedencies";
import { useState } from "react"
import { toast } from "sonner";

export const useBookingVerification = (refresh?: () => void) => {
    const { bookingService } = useDepedencies()

    // UI state
    const [selectedBookingId, setSelectedBookingId] = useState<number>(0);
    const [openApprovalDialog, setOpenApprovalDialog] = useState<boolean>(false)
    const [openRejectionDialog, setOpenRejectionDialog] = useState<boolean>(false)
    const [openReturnVerificationDialog, setOpenReturnVerificationDialog] = useState<boolean>(false)
    const [openReturnConfirmationDialog, setOpenReturnConfirmationDialog] = useState<boolean>(false)
    const [approvalType, setApprovalType] = useState<'equipment_approve' | 'approve' | null>(null)

    // Action
    const handleEquipmentApproval = async (information: string, laboratory_room_id: number | null, is_allowed_offsite: boolean) => {
        if (!setSelectedBookingId) return
        const res = await bookingService.verifyBooking(selectedBookingId, {
            action: 'approve',
            information: information,
            laboratory_room_id: laboratory_room_id,
            is_allowed_offsite: is_allowed_offsite
        })
        toast.success(res.message)
        setOpenRejectionDialog(false)
        setOpenApprovalDialog(false);
        refresh?.()
    }
    
    const handleReturnVerification = async (information: string): Promise<void> => {
        if (!selectedBookingId) return

        const res = await bookingService.verifyBookingReturn(selectedBookingId, information)
        toast.success(res.message);
        setOpenApprovalDialog(false);
        refresh?.()
    }

    const handleApproval = async (information: string): Promise<void> => {
        if (!selectedBookingId) return

        const res = await bookingService.verifyBooking(selectedBookingId, {
            action: 'approve',
            information: information
        })
        toast.success(res.message);
        setOpenApprovalDialog(false);
        refresh?.()
    }

    const handleRejection = async (information: string): Promise<void> => {
        if (!selectedBookingId) return
        const res = await bookingService.verifyBooking(selectedBookingId, {
            action: 'reject',
            information: information
        });
        toast.success(res.message);
        setOpenRejectionDialog(false);
        refresh?.();
    };

    return {
        // UI
        selectedBookingId,
        setSelectedBookingId,
        openApprovalDialog,
        setOpenApprovalDialog,
        openRejectionDialog,
        setOpenRejectionDialog,
        approvalType,
        setApprovalType,
        openReturnVerificationDialog,
        setOpenReturnVerificationDialog,
        openReturnConfirmationDialog,
        setOpenReturnConfirmationDialog,

        // Action
        handleApproval,
        handleRejection,
        handleEquipmentApproval,
        handleReturnVerification
    }
}