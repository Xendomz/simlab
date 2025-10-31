import React, { useEffect, useState } from 'react'
// import { useLaboratoryRoom } from '@/application/laboratory-room/hooks/useLaboratoryRoom';
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
import { useValidationErrors } from '@/presentation/hooks/useValidationError';
import { toast } from 'sonner';
import { ApiResponse } from '@/shared/Types';
import { Combobox } from '@/presentation/components/custom/combobox';
import { Textarea } from '@/presentation/components/ui/textarea';
import { useLaboratoryRoomSelect } from '../../laboratory-room/hooks/useLaboratoryRoomSelect';

interface LaboranBookingApprovalEquipmentDialogProps {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    handleSave: (action: 'approve' | 'reject' | 'revision', information: string, laboratory_room_id?: number, is_allowed_offsite?: boolean | null) => Promise<void>
}

const LaboranBookingApprovalEquipmentDialog: React.FC<LaboranBookingApprovalEquipmentDialogProps> = ({ open, onOpenChange, handleSave }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<string>('');
    const [reason, setReason] = useState<string>("");
    const [isAllowedOffsite, setIsAllowedOffsite] = useState<boolean>(false);
    const { errors, processErrors } = useValidationErrors()

    const { laboratoryRooms, selectedLaboratoryRoom, setSelectedLaboratoryRoom } = useLaboratoryRoomSelect()

    useEffect(() => {
        setSelectedRoom('');
        setIsAllowedOffsite(false);
    }, [open]);

    const onSubmit = async () => {
        setIsSubmitting(true);
        try {
            await handleSave('approve', reason, selectedRoom ? Number(selectedRoom) : undefined, isAllowedOffsite);
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
                <div className='flex flex-col gap-5'>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="ruangan">Ruangan Laboratorium</Label>
                        <div>
                            <Combobox
                                options={laboratoryRooms}
                                value={selectedLaboratoryRoom.toString() || ''}
                                onChange={(val) => setSelectedLaboratoryRoom(Number(val))}
                                placeholder="Pilih Ruangan Laboratorium"
                                optionLabelKey='name'
                                optionValueKey='id'
                            />
                            {errors['laboratory_room_id'] && (
                                <p className=" text-xs italic text-red-500">{errors['laboratory_room_id']}</p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="is_allowed_offsite" checked={isAllowedOffsite} onCheckedChange={v => setIsAllowedOffsite(!!v)} />
                            <Label htmlFor="is_allowed_offsite">Alat boleh dibawa ke luar ruangan</Label>
                        </div>
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

export default LaboranBookingApprovalEquipmentDialog
