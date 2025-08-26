import { LaboratoryEquipmentInputDTO } from '@/application/laboratory-equipment/dto/LaboratoryEquipmentDTO'
import { LaboratoryEquipmentView } from '@/application/laboratory-equipment/LaboratoryEquipmentView'
import { LaboratoryRoomView } from '@/application/laboratory-room/LaboratoryRoomView'
import { Button } from '@/presentation/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/presentation/components/ui/select'
import { Textarea } from '@/presentation/components/ui/textarea'
import { useValidationErrors } from '@/presentation/hooks/useValidationError'
import { ApiResponse } from '@/shared/Types'
import React, { useEffect, useState } from 'react'

interface LaboratoryEquipmentFormDialogProps {
    title: string,
    open: boolean,
    laboratoryRoom: LaboratoryRoomView[]
    data: any
    dataId: number | null,
    onOpenChange: (open: boolean) => void,
    handleSave: (data: any) => Promise<void>
}

const LaboratoryEquipmentFormDialog: React.FC<LaboratoryEquipmentFormDialogProps> = ({
    title,
    open,
    data,
    laboratoryRoom,
    dataId,
    onOpenChange,
    handleSave
}) => {
    const [formData, setFormData] = useState<LaboratoryEquipmentInputDTO>({
        equipment_name: '',
        ruangan_laboratorium_id: 0,
        quantity: 0,
        unit: '',
        function: '',
        photo: '',
        brand: '',
        equipment_type: '',
        origin: '',
        condition: '',
        condition_description: '',
        asset_code: ''
    });
    const { errors, setErrors, processErrors } = useValidationErrors()
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setErrors({})
    }, [open])

    useEffect(() => {
        if (dataId) {
            const selectedData = data.find((data: LaboratoryEquipmentView) => data.id == dataId)

            // reset photo state value to pass nullable validation
            setFormData({
                equipment_name: selectedData.equipmentName,
                ruangan_laboratorium_id: selectedData.ruanganLaboratoriumId,
                quantity: selectedData.quantity,
                unit: selectedData.unit,
                function: selectedData.equipmentFunction,
                photo: null,
                brand: selectedData.brand,
                equipment_type: selectedData.equipmentType,
                origin: selectedData.origin,
                condition: selectedData.condition,
                condition_description: selectedData.conditionDescription,
                asset_code: selectedData.assetCode
            });
        } else {
            setFormData({
                equipment_name: '',
                ruangan_laboratorium_id: 0,
                quantity: 0,
                unit: '',
                function: '',
                photo: null,
                brand: '',
                equipment_type: '',
                origin: '',
                condition: '',
                condition_description: '',
                asset_code: ''
            })
        }

    }, [dataId])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

        if (name === 'photo' && (e.target as HTMLInputElement).files) {
            setFormData((prev) => ({ ...prev, photo: (e.target as HTMLInputElement).files ? (e.target as HTMLInputElement).files![0] : null }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
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
            <DialogContent className="sm:max-w-xl grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[90dvh]">
                <DialogHeader className='p-6'>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <form className='grid md:grid-cols-2 gap-x-2 gap-y-5 w-full overflow-y-auto px-6 pb-6' encType="multipart/form-data">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor='testing_type'>
                            Kode Aset <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type='text'
                            id='asset_code'
                            name='asset_code'
                            value={formData['asset_code'] || ''}
                            onChange={handleChange}
                            placeholder='Kode Aset'
                        />
                        {errors['asset_code'] && (
                            <p className="mt-1 text-xs italic text-red-500">{errors['asset_code']}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor='testing_type'>
                            Nama Alat <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type='text'
                            id='equipment_name'
                            name='equipment_name'
                            value={formData['equipment_name'] || ''}
                            onChange={handleChange}
                            placeholder='Nama Alat'
                        />
                        {errors['equipment_name'] && (
                            <p className="mt-1 text-xs italic text-red-500">{errors['equipment_name']}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor='testing_type'>
                            Merek Alat <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type='text'
                            id='brand'
                            name='brand'
                            value={formData['brand'] || ''}
                            onChange={handleChange}
                            placeholder='Merek Alat'
                        />
                        {errors['brand'] && (
                            <p className="mt-1 text-xs italic text-red-500">{errors['brand']}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor='testing_type'>
                            Foto Alat
                        </Label>
                        <Input
                            type='file'
                            id='photo'
                            name='photo'
                            accept=".jpg,.jpeg,.png,.webp"
                            onChange={handleChange}
                        />
                        {errors['photo'] && (
                            <p className="mt-1 text-xs italic text-red-500">{errors['photo']}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                        <Label htmlFor='testing_type'>
                            Fungsi Alat
                        </Label>
                        <Textarea
                            name="function"
                            id="function"
                            onChange={handleChange}
                            placeholder='Fungsi Alat'
                            value={formData['function'] || ''}
                        >
                        </Textarea>
                        {errors['function'] && (
                            <p className="mt-1 text-xs italic text-red-500">{errors['function']}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor='testing_type'>
                            Jumlah Alat <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type='number'
                            id='quantity'
                            name='quantity'
                            value={formData['quantity'] || ''}
                            onChange={handleChange}
                            placeholder='0'
                        />
                        {errors['quantity'] && (
                            <p className="mt-1 text-xs italic text-red-500">{errors['quantity']}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor='testing_type'>
                            Satuan Alat <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type='text'
                            id='unit'
                            name='unit'
                            value={formData['unit'] || ''}
                            onChange={handleChange}
                            placeholder='Satuan Alat'
                        />
                        {errors['unit'] && (
                            <p className="mt-1 text-xs italic text-red-500">{errors['unit']}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor='testing_type'>
                            Lokasi Alat <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            name='ruangan_laboratorium_id'
                            value={formData['ruangan_laboratorium_id'] ? String(formData['ruangan_laboratorium_id']) : ''}
                            onValueChange={(value) =>
                                handleChange({
                                    target: {
                                        name: 'ruangan_laboratorium_id',
                                        value: value
                                    }
                                } as React.ChangeEvent<HTMLSelectElement>)
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Lokasi" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Ruangan</SelectLabel>
                                    {laboratoryRoom?.map((option) => (
                                        <SelectItem key={option.id} value={option.id.toString()}>{option.name}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors['ruangan_laboratorium_id'] && (
                            <p className="mt-1 text-xs italic text-red-500">{errors['ruangan_laboratorium_id']}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor='testing_type'>
                            Jenis Alat <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            name='equipment_type'
                            value={formData['equipment_type'] ? String(formData['equipment_type']) : ''}
                            onValueChange={(value) =>
                                handleChange({
                                    target: {
                                        name: 'equipment_type',
                                        value: value
                                    }
                                } as React.ChangeEvent<HTMLSelectElement>)
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Jenis Alat" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Jenis Alat</SelectLabel>
                                    <SelectItem value="Barang BMN">Barang BMN</SelectItem>
                                    <SelectItem value="Barang BHPL">Barang BHPL</SelectItem>
                                    <SelectItem value="Barang Hibah">Barang Hibah</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors['equipment_type'] && (
                            <p className="mt-1 text-xs italic text-red-500">{errors['equipment_type']}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor='testing_type'>
                            Asal Alat <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type='text'
                            id='origin'
                            name='origin'
                            value={formData['origin'] || ''}
                            onChange={handleChange}
                            placeholder='Asal Alat'
                        />
                        {errors['origin'] && (
                            <p className="mt-1 text-xs italic text-red-500">{errors['origin']}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor='testing_type'>
                            Kondisi Alat <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            name='condition'
                            value={formData['condition'] ? String(formData['condition']) : ''}
                            onValueChange={(value) =>
                                handleChange({
                                    target: {
                                        name: 'condition',
                                        value: value
                                    }
                                } as React.ChangeEvent<HTMLSelectElement>)
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Kodisi Alat" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Kondisi Alat</SelectLabel>
                                    <SelectItem value="Baik">Baik</SelectItem>
                                    <SelectItem value="Rusak">Rusak</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors['condition'] && (
                            <p className="mt-1 text-xs italic text-red-500">{errors['condition']}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2 md:col-span-2">
                        <Label htmlFor='testing_type'>
                            Keterangan Kondisi Alat
                        </Label>
                        <Textarea
                            name="condition_description"
                            id="condition_description"
                            onChange={handleChange}
                            placeholder='Keterangan'
                            value={formData['condition_description'] || ''}
                        >
                        </Textarea>
                        {errors['condition_description'] && (
                            <p className="mt-1 text-xs italic text-red-500">{errors['condition_description']}</p>
                        )}
                    </div>
                </form>
                <DialogFooter className='p-6'>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                    <Button type="button" onClick={handleSubmit}>
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default LaboratoryEquipmentFormDialog
