import { PracticumSchedulingVerifyDTO } from '@/application/practicum-scheduling/dto/PracticumSchedulingDTO';
import { useUser } from '@/application/user/hooks/useUser';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select'

interface KepalaLabTerpaduPracticumScheduleApprovalDialogProps {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    handleSave: (data: PracticumSchedulingVerifyDTO) => Promise<void>
}

const KepalaLabTerpaduPracticumScheduleApprovalDialog: React.FC<KepalaLabTerpaduPracticumScheduleApprovalDialogProps> = ({ open, onOpenChange, handleSave }) => {
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
                    <Select value={selectedLaboran} onValueChange={setSelectedLaboran}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih Laboran" />
                        </SelectTrigger>
                        <SelectContent>
                            {laboran.length === 0 ? (
                                <SelectItem value="''" disabled>Tidak ada laboran tersedia</SelectItem>
                            ) : (
                                laboran.map(l => (
                                    <SelectItem key={l.id} value={String(l.id)}>
                                        {l.name} <span className="text-xs text-muted-foreground">({l.email})</span>
                                    </SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>
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

export default KepalaLabTerpaduPracticumScheduleApprovalDialog