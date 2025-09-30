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
import { Label } from '@/presentation/components/ui/label'
import { Textarea } from '@/presentation/components/ui/textarea'
import { useValidationErrors } from '@/presentation/hooks/useValidationError'
import { toast } from 'sonner'
import { ApiResponse } from '@/shared/Types'

interface LaboranBookingApprovalDialogProps {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    handleSave: (action: 'approve' | 'reject' | 'revision', information: string) => Promise<void>
}

const LaboranBookingApprovalDialog: React.FC<LaboranBookingApprovalDialogProps> = ({ open, onOpenChange, handleSave }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reason, setReason] = useState<string>("");
    const { errors, processErrors } = useValidationErrors()

    const onSubmit = async () => {
        setIsSubmitting(true);
        try {
            await handleSave('approve', reason);
            onOpenChange(false);
        } catch (e) {
            const error = e as ApiResponse
            toast.error(error.message || 'Gagal submit')

            if (error.errors) {
                processErrors(error.errors);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Verifikasi Peminjaman Laboratorium</DialogTitle>
                    <DialogDescription>
                        Apakah anda yakin untuk melakukan verifikasi terhadap Peminjaman Ruangan Laboratorium Terpadu ITK?
                    </DialogDescription>
                </DialogHeader>
                <div className='flex flex-col gap-5'>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="reason">Catatan (*optional)</Label>
                        <div className="flex flex-col gap-1">
                            <Textarea
                                id="reason"
                                value={reason}
                                onChange={e => setReason(e.target.value)}
                                placeholder="Masukkan Catatan"
                                rows={4}
                            />
                            {errors['information'] && (
                                <p className=" text-xs italic text-red-500">{errors['information']}</p>
                            )}
                        </div>
                    </div>
                </div>
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
