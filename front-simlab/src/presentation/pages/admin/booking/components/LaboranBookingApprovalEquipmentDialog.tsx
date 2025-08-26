import React, { useEffect, useState } from 'react'
import { useLaboratoryRoom } from '@/application/laboratory-room/hooks/useLaboratoryRoom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';
import { Checkbox } from '@/presentation/components/ui/checkbox';
import { Label } from '@/presentation/components/ui/label';
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
import { useValidationErrors } from '@/presentation/hooks/useValidationError';
import { toast } from 'sonner';
import { ApiResponse } from '@/shared/Types';

interface LaboranBookingApprovalEquipmentDialogProps {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    handleSave: (data: BookingVerifyDTO) => Promise<void>
}

const LaboranBookingApprovalEquipmentDialog: React.FC<LaboranBookingApprovalEquipmentDialogProps> = ({ open, onOpenChange, handleSave }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<string>('');
    const [isAllowedOffsite, setIsAllowedOffsite] = useState<boolean>(false);
    const { errors, processErrors } = useValidationErrors()

    const {
        laboratoryRoom: rooms,
        isLoading: loadingRooms,
        getData: getRooms
    } = useLaboratoryRoom({
        currentPage: 1,
        perPage: 9999,
        searchTerm: '',
        setTotalPages: () => { },
        setTotalItems: () => { }
    });

    useEffect(() => {
        if (open) getRooms();
        if (!open) {
            setSelectedRoom('');
            setIsAllowedOffsite(false);
        }
    }, [open, getRooms]);

    const onSubmit = async () => {
        setIsSubmitting(true);
        try {
            await handleSave({
                action: 'approve',
                ruangan_laboratorium_id: selectedRoom ? Number(selectedRoom) : undefined,
                is_allowed_offsite: isAllowedOffsite,
            });
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
                    <DialogTitle>Verifikasi Peminjaman Alat</DialogTitle>
                    <DialogDescription>
                        Pilih ruangan laboratorium tempat alat akan digunakan dan tentukan apakah alat boleh dibawa ke luar ruangan.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-2">
                    <div>
                        <Label htmlFor="ruangan">Ruangan Laboratorium</Label>
                        <Select value={selectedRoom} onValueChange={setSelectedRoom} disabled={loadingRooms}>
                            <SelectTrigger id="ruangan" className="mt-1 w-full">
                                <SelectValue placeholder={loadingRooms ? 'Memuat...' : 'Pilih ruangan'} />
                            </SelectTrigger>
                            <SelectContent>
                                {rooms.length === 0 && <SelectItem value="''" disabled>Tidak ada ruangan</SelectItem>}
                                {rooms.map((room: any) => (
                                    <SelectItem key={room.id} value={String(room.id)}>{room.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors['ruangan_laboratorium_id'] && (
                            <p className=" text-xs italic text-red-500">{errors['ruangan_laboratorium_id']}</p>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox id="is_allowed_offsite" checked={isAllowedOffsite} onCheckedChange={v => setIsAllowedOffsite(!!v)} />
                        <Label htmlFor="is_allowed_offsite">Alat boleh dibawa ke luar ruangan</Label>
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

export default LaboranBookingApprovalEquipmentDialog
