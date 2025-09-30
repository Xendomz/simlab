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
import { useUser } from '@/application/user/hooks/useUser'
import { Combobox } from '@/presentation/components/custom/combobox'
import { Label } from '@/presentation/components/ui/label'
import { Textarea } from '@/presentation/components/ui/textarea'
import { useValidationErrors } from '@/presentation/hooks/useValidationError'
import { toast } from 'sonner'
import { ApiResponse } from '@/shared/Types'

interface KepalaLabBookingApprovalDialogProps {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    handleSave: (action: 'approve' | 'reject' | 'revision', information: string, laboran_id?: number) => Promise<void>
}

const KepalaLabBookingApprovalDialog: React.FC<KepalaLabBookingApprovalDialogProps> = ({ open, onOpenChange, handleSave }) => {
    const [selectedLaboran, setSelectedLaboran] = useState<string>('');
    const [reason, setReason] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { errors, processErrors } = useValidationErrors()

    const {
        user: laboran,
        getData,
    } = useUser({
        currentPage: 1,
        perPage: 9999,
        role: 'Laboran',
        filter_study_program: 0,
        searchTerm: '',
        setTotalPages() { },
        setTotalItems() { },
    });

    useEffect(() => {
        getData()
    }, [])
    useEffect(() => {
        setSelectedLaboran('')
    }, [open])

    const onSubmit = async () => {
        setIsSubmitting(true);
        try {
            await handleSave('approve', reason, selectedLaboran ? Number(selectedLaboran) : undefined);
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
                    <DialogTitle>Pilih Laboran</DialogTitle>
                    <DialogDescription>Verifikasi peminjaman ruangan laboratorium dan berikan tugas kepada petugas laboran terkait untuk membantu menggunakan ruangan laboratorium tersebut. Silahkan pilih salah satu dari daftar laboran yang ada dibawah ini:</DialogDescription>
                </DialogHeader>
                <div className='flex flex-col gap-5'>
                    <div className="flex flex-col gap-2">
                        <Combobox
                            options={laboran}
                            value={selectedLaboran}
                            onChange={(val) => setSelectedLaboran(String(val))}
                            placeholder="Pilih Laboran"
                            optionLabelKey='name'
                            optionValueKey='id'
                        />
                        {errors['laboran_id'] && (
                            <p className=" text-xs italic text-red-500">{errors['laboran_id']}</p>
                        )}
                    </div>
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

export default KepalaLabBookingApprovalDialog
