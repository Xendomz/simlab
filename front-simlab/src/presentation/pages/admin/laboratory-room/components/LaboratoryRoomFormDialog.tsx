import { LaboratoryRoomInputDTO } from '@/application/laboratory-room/LaboratoryRoomDTO';
import { LaboratoryRoomView } from '@/application/laboratory-room/LaboratoryRoomView';
import { UserView } from '@/application/user/UserView';
import { Combobox } from '@/presentation/components/custom/combobox';
import { Button } from '@/presentation/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { ScrollArea } from '@/presentation/components/ui/scroll-area';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';
import { useValidationErrors } from '@/presentation/hooks/useValidationError';
import { ApiResponse } from '@/shared/Types';
import React, { useEffect, useState } from 'react'

interface LaboratoryRoomFormDialogProps {
    title: string,
    open: boolean,
    laboran: UserView[]
    data: LaboratoryRoomView[],
    dataId: number | null,
    onOpenChange: (open: boolean) => void,
    handleSave: (data: any) => Promise<void>
}

const LaboratoryRoomFormDialog: React.FC<LaboratoryRoomFormDialogProps> = ({
    title,
    open,
    laboran,
    data,
    dataId,
    onOpenChange,
    handleSave
}) => {
    const defaultFormData: LaboratoryRoomInputDTO = {
        name: '',
        floor: '',
        user_id: null,
        student_price: null,
        lecturer_price: null,
        external_price: null
    }
    const [formData, setFormData] = useState<LaboratoryRoomInputDTO>(defaultFormData);
    const { errors, setErrors, processErrors } = useValidationErrors()
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setErrors({})
        if (dataId) {
            const selectedLaboratoryRoom = data.find((laboratoryRoom) => laboratoryRoom.id == dataId)
            if (selectedLaboratoryRoom) {
                setFormData({
                    name: selectedLaboratoryRoom.name,
                    floor: selectedLaboratoryRoom.floor,
                    user_id: selectedLaboratoryRoom.user?.id ?? null,
                    student_price: selectedLaboratoryRoom.studentPrice.amount ?? null,
                    lecturer_price: selectedLaboratoryRoom.lecturerPrice.amount ?? null,
                    external_price: selectedLaboratoryRoom.externalPrice.amount ?? null,
                })
            }
        } else {
            setFormData(defaultFormData)
        }
    }, [open])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await handleSave(formData);
        } catch (e) {
            const error = e as ApiResponse
            if (error.errors) {
                processErrors(error.errors);
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
                    <ScrollArea className='h-full max-h-[70vh]'>
                        <div className='flex flex-col gap-5'>
                            <div className='flex flex-col gap-2'>
                                <Label htmlFor='name'>
                                    Nama Ruangan <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    type='text'
                                    id='name'
                                    name='name'
                                    value={formData['name'] || ''}
                                    onChange={handleChange}
                                    placeholder='Nama Ruangan'
                                />
                                {errors['name'] && (
                                    <p className="mt-1 text-xs italic text-red-500">{errors['name']}</p>
                                )}
                            </div>

                            <div className='flex flex-col gap-2'>
                                <Label htmlFor='floor'>
                                    Ruangan <span className="text-red-500">*</span>
                                </Label>
                                <Select name='floor' value={formData['floor']} onValueChange={(value) =>
                                    handleChange({
                                        target: {
                                            name: 'floor',
                                            value: value
                                        }
                                    } as React.ChangeEvent<HTMLInputElement>)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Lantai" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Lantai</SelectLabel>
                                            <SelectItem value="Lantai 1">Lantai 1</SelectItem>
                                            <SelectItem value="Lantai 2">Lantai 2</SelectItem>
                                            <SelectItem value="Lantai 3">Lantai 3</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {errors['floor'] && (
                                    <p className="mt-1 text-xs italic text-red-500">{errors['floor']}</p>
                                )}
                            </div>

                            <div className='flex flex-col gap-2'>
                                <Label htmlFor='user'>
                                    Petugas Laboran <span className="text-red-500">*</span>
                                </Label>
                                <Combobox
                                    options={laboran}
                                    value={formData.user_id?.toString() || ''}
                                    onChange={(val) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            user_id: val ? Number(val) : null
                                        }))
                                    }}
                                    placeholder="Pilih Laboran"
                                    optionLabelKey='name'
                                    optionValueKey='id'
                                />
                                {errors['user_id'] && (
                                    <p className="mt-1 text-xs italic text-red-500">{errors['user_id']}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor='student_price'>
                                    Harga Mahasiswa <span className="text-red-500">*</span>
                                </Label>
                                <div>
                                    <Input
                                        type='number'
                                        id='student_price'
                                        name='student_price'
                                        value={formData['student_price'] ?? ''}
                                        onChange={handleChange}
                                        placeholder='Harga mahasiswa'
                                    />
                                    {errors['student_price'] && (
                                        <p className="mt-1 text-xs italic text-red-500">{errors['student_price']}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor='lecturer_price'>
                                    Harga Dosen <span className="text-red-500">*</span>
                                </Label>
                                <div>
                                    <Input
                                        type='number'
                                        id='lecturer_price'
                                        name='lecturer_price'
                                        value={formData['lecturer_price'] ?? ''}
                                        onChange={handleChange}
                                        placeholder='Harga Dosen'
                                    />
                                    {errors['lecturer_price'] && (
                                        <p className="mt-1 text-xs italic text-red-500">{errors['lecturer_price']}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor='external_price'>
                                    Harga Pihak External <span className="text-red-500">*</span>
                                </Label>
                                <div>
                                    <Input
                                        type='number'
                                        id='external_price'
                                        name='external_price'
                                        value={formData['external_price'] ?? ''}
                                        onChange={handleChange}
                                        placeholder='Harga Pihak External'
                                    />
                                    {errors['external_price'] && (
                                        <p className="mt-1 text-xs italic text-red-500">{errors['external_price']}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Tutup
                            </Button>
                        </DialogClose>
                        <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default LaboratoryRoomFormDialog
