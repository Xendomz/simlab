import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
    DialogDescription
} from '@/presentation/components/ui/dialog'
import { Button } from '@/presentation/components/ui/button'
import { BookingVerifyDTO } from '@/application/booking/dto/BookingDTO'

interface LaboranBookingApprovalDialogProps {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    handleSave: (data: BookingVerifyDTO) => Promise<void>
}

const LaboranBookingApprovalDialog: React.FC<LaboranBookingApprovalDialogProps> = ({ open, onOpenChange, handleSave }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
    }, [open])

    const onSubmit = async () => {
        setIsSubmitting(true);
        try {
            await handleSave({'action': 'approve'});
            onOpenChange(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Pilih Laboran</DialogTitle>
                    <DialogDescription>
                        Apakah anda yakin untuk melakukan verifikasi terhadap Peminjaman Ruangan Laboratorium Terpadu ITK?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Batal</Button>
                    </DialogClose>
                    <Button type="button" onClick={onSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default LaboranBookingApprovalDialog
