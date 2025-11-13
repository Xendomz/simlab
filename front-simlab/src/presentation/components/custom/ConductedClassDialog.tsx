import { useValidationErrors } from '@/presentation/hooks/useValidationError';
import React, { useState } from 'react'
import { toast } from 'sonner';
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
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { ApiResponse } from '@/shared/Types';

interface ConductedClassDialogProps {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    handleSave: (information: string) => Promise<void>,
}

const ConductedClassDialog: React.FC<ConductedClassDialogProps> = ({
    open,
    onOpenChange,
    handleSave
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [information, setInformation] = useState<string>('')
    const { errors, processErrors } = useValidationErrors()

    const onSubmit = async () => {
        setIsSubmitting(true);
        try {
            await handleSave(information)
            onOpenChange(false)
        } catch (e) {
            const error = e as ApiResponse
            toast.error(error.message || 'Gagal submit')

            if (error.errors) {
                processErrors(error.errors);
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Konfirmasi Verifikasi</DialogTitle>
                    <DialogDescription>Apakah Anda yakin ingin melanjutkan proses verifikasi?</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="reason">Catatan (*optional)</Label>
                        <div className="flex flex-col gap-1">
                            <Textarea
                                id="reason"
                                value={information}
                                onChange={e => setInformation(e.target.value)}
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
                        {isSubmitting ? 'Memproses...' : 'Verifikasi'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
export default ConductedClassDialog