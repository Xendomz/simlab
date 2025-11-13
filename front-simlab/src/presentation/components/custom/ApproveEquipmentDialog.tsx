import { useValidationErrors } from '@/presentation/hooks/useValidationError'
import { useLaboratoryRoomSelect } from '@/presentation/pages/admin/laboratory-room/hooks/useLaboratoryRoomSelect'
import { ApiResponse } from '@/shared/Types'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
    DialogDescription
} from '@/presentation/components/ui/dialog'
import { Checkbox } from '@/presentation/components/ui/checkbox';
import { Label } from '@/presentation/components/ui/label';
import { Combobox } from '@/presentation/components/custom/combobox';
import { Textarea } from '@/presentation/components/ui/textarea';
import { Button } from '@/presentation/components/ui/button'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface ApproveEquipmentDialogProps {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    handleSave: (information: string, laboratory_room_id: number | null, is_allowed_offsite: boolean) => Promise<void>
}

const ApproveEquipmentDialog: React.FC<ApproveEquipmentDialogProps> = ({
    open,
    onOpenChange,
    handleSave
}) => {
    const { laboratoryRooms } = useLaboratoryRoomSelect()
    const [information, setInformation] = useState<string>('')
    const [isAllowedOffsite, setIsAllowedOffsite] = useState<boolean>(false)
    const [selectedLaboratoryRoom, setSelectedLaboratoryRoom] = useState<number | null>(null)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const { errors, setErrors, processErrors } = useValidationErrors()

    useEffect(() => {
        setSelectedLaboratoryRoom(null)
        setInformation('')
        setIsAllowedOffsite(false)
    }, [open])

    const onSubmit = async () => {
        setIsSubmitting(true)
        setErrors({})

        try {
            await handleSave(information, selectedLaboratoryRoom, isAllowedOffsite)
            onOpenChange(false)
        } catch (e) {
            const error = e as ApiResponse
            toast.error(error.message || 'Gagal Submit')

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
                                value={selectedLaboratoryRoom?.toString() || ''}
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
                        {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ApproveEquipmentDialog