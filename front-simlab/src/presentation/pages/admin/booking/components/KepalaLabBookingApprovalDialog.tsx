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
import { BookingVerifyDTO } from '@/application/booking/dto/BookingDTO'
import { Combobox } from '@/presentation/components/custom/combobox'

interface KepalaLabBookingApprovalDialogProps {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    handleSave: (data: BookingVerifyDTO) => Promise<void>
}

const KepalaLabBookingApprovalDialog: React.FC<KepalaLabBookingApprovalDialogProps> = ({ open, onOpenChange, handleSave }) => {
    const [selectedLaboran, setSelectedLaboran] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        if (!selectedLaboran) return;
        setIsSubmitting(true);
        try {
            await handleSave({ laboran_id: Number(selectedLaboran), 'action': 'approve' });
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
                    <DialogDescription>Verifikasi peminjaman ruangan laboratorium dan berikan tugas kepada petugas laboran terkait untuk membantu menggunakan ruangan laboratorium tersebut. Silahkan pilih salah satu dari daftar laboran yang ada dibawah ini:</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-3">
                    <Combobox
                        options={laboran}
                        value={selectedLaboran}
                        onChange={(val) => setSelectedLaboran(String(val))}
                        placeholder="Pilih Laboran"
                        optionLabelKey='name'
                        optionValueKey='id'
                    />
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Batal</Button>
                    </DialogClose>
                    <Button type="button" onClick={onSubmit} disabled={!selectedLaboran || isSubmitting}>
                        {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default KepalaLabBookingApprovalDialog
