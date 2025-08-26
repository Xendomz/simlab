import { PracticumSchedulingVerifyDTO } from '@/application/practicum-scheduling/dto/PracticumSchedulingDTO'
import React, { useState } from 'react'
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

interface LaboranPracticumScheduleApprovalDialogProps {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    handleSave: (data: PracticumSchedulingVerifyDTO) => Promise<void>
}

const LaboranPracticumScheduleApprovalDialog: React.FC<LaboranPracticumScheduleApprovalDialogProps> = ({ open, onOpenChange, handleSave }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const onSubmit = async () => {
        setIsSubmitting(true)
        try {
            await handleSave({ action: 'approve' })
            onOpenChange(false)
        } finally {
            setIsSubmitting(false)
        }
    }
    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Verifikasi Pengajuan Praktikum</DialogTitle>
                        <DialogDescription>Apakah anda yakin untuk memverifikasi jadwal pemakaian ruangan laboratorium?</DialogDescription>
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
        </>
    )
}

export default LaboranPracticumScheduleApprovalDialog