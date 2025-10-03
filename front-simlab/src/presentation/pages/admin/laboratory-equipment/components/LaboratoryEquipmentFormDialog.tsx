import { LaboratoryEquipmentInputDTO } from '@/application/laboratory-equipment/LaboratoryEquipmentDTO'
import { LaboratoryEquipmentView } from '@/application/laboratory-equipment/LaboratoryEquipmentView'
import { LaboratoryRoomSelectView } from '@/application/laboratory-room/LaboratoryRoomSelectView'
import { Combobox } from '@/presentation/components/custom/combobox'
import { Button } from '@/presentation/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { ScrollArea } from '@/presentation/components/ui/scroll-area'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/presentation/components/ui/select'
import { Textarea } from '@/presentation/components/ui/textarea'
import { useValidationErrors } from '@/presentation/hooks/useValidationError'
import { ApiResponse } from '@/shared/Types'
import React, { useEffect, useState } from 'react'

interface LaboratoryEquipmentFormDialogProps {
    title: string,
    open: boolean,
    laboratoryRooms: LaboratoryRoomSelectView[]
    data: LaboratoryEquipmentView[]
    dataId: number | null,
    onOpenChange: (open: boolean) => void,
    handleSave: (data: any) => Promise<void>
}

const LaboratoryEquipmentFormDialog: React.FC<LaboratoryEquipmentFormDialogProps> = ({
    title,
    open,
    data,
    laboratoryRooms,
    dataId,
    onOpenChange,
    handleSave
}) => {
    const defaultFormData: LaboratoryEquipmentInputDTO = {
        equipment_name: '',
        laboratory_room_id: 0,
        quantity: 0,
        unit: '',
        function: '',
        photo: '',
        brand: '',
        equipment_type: '',
        origin: '',
        condition: '',
        condition_description: '',
        asset_code: '',
        student_price: null,
        lecturer_price: null,
        external_price: null
    }

    const [formData, setFormData] = useState<LaboratoryEquipmentInputDTO>(defaultFormData);
    const { errors, setErrors, processErrors } = useValidationErrors()
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setErrors({})
    }, [open])

    useEffect(() => {
        if (dataId) {
            const selectedLaboratoryEquipment = data.find((data: LaboratoryEquipmentView) => data.id == dataId)

            // reset photo state value to pass nullable validation
            if (selectedLaboratoryEquipment) {
                setFormData({
                    equipment_name: selectedLaboratoryEquipment.equipmentName,
                    laboratory_room_id: selectedLaboratoryEquipment.laboratoryRoom?.id ?? 0,
                    quantity: selectedLaboratoryEquipment.quantity,
                    unit: selectedLaboratoryEquipment.unit,
                    function: selectedLaboratoryEquipment.equipmentFunction,
                    photo: null,
                    brand: selectedLaboratoryEquipment.brand,
                    equipment_type: selectedLaboratoryEquipment.equipmentType,
                    origin: selectedLaboratoryEquipment.origin,
                    condition: selectedLaboratoryEquipment.condition,
                    condition_description: selectedLaboratoryEquipment.conditionDescription,
                    asset_code: selectedLaboratoryEquipment.assetCode,
                    student_price: selectedLaboratoryEquipment.studentPrice.amount,
                    lecturer_price: selectedLaboratoryEquipment.lecturerPrice.amount,
                    external_price: selectedLaboratoryEquipment.externalPrice.amount,
                });
            }
        } else {
            setFormData(defaultFormData)
        }

    }, [open])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { type, name, value } = e.target;
        let newValue = value;
        
        if (type === "number") {
            if (newValue.length > 1 && newValue.startsWith('0')) {
                newValue = newValue.replace(/^0+/, '');
                if (newValue === '') newValue = '0';
            }
        }
        if (name === 'photo' && (e.target as HTMLInputElement).files) {
            setFormData((prev) => ({ ...prev, photo: (e.target as HTMLInputElement).files ? (e.target as HTMLInputElement).files![0] : null }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: newValue }));
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
            <DialogContent className="md:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <form encType="multipart/form-data" className='flex flex-col gap-5'>
                    <ScrollArea className='h-full max-h-[70vh]'>
                        <div className='grid md:grid-cols-2 gap-x-2 gap-y-5 p-1'>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor='testing_type'>
                                    Kode Aset <span className="text-red-500">*</span>
                                </Label>
                                <div>
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
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor='testing_type'>
                                    Nama Alat <span className="text-red-500">*</span>
                                </Label>
                                <div>
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
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor='testing_type'>
                                    Merek Alat <span className="text-red-500">*</span>
                                </Label>
                                <div>
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
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor='testing_type'>
                                    Foto Alat
                                </Label>
                                <div>
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
                            </div>
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <Label htmlFor='testing_type'>
                                    Fungsi Alat
                                </Label>
                                <div>
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
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor='testing_type'>
                                    Jumlah Alat <span className="text-red-500">*</span>
                                </Label>
                                <div>
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
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor='testing_type'>
                                    Satuan Alat <span className="text-red-500">*</span>
                                </Label>
                                <div>
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
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor='testing_type'>
                                    Lokasi Alat <span className="text-red-500">*</span>
                                </Label>
                                <div>
                                    <Combobox
                                        options={laboratoryRooms}
                                        value={formData.laboratory_room_id?.toString() || ''}
                                        onChange={(val) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                laboratory_room_id: val ? Number(val) : 0
                                            }))
                                        }}
                                        placeholder="Pilih Lokasi"
                                        optionLabelKey='name'
                                        optionValueKey='id'
                                    />
                                    {errors['laboratory_room_id'] && (
                                        <p className="mt-1 text-xs italic text-red-500">{errors['laboratory_room_id']}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor='testing_type'>
                                    Jenis Alat <span className="text-red-500">*</span>
                                </Label>
                                <div>
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
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor='testing_type'>
                                    Asal Alat <span className="text-red-500">*</span>
                                </Label>
                                <div>
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
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor='testing_type'>
                                    Kondisi Alat <span className="text-red-500">*</span>
                                </Label>
                                <div>
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
                            </div>
                            <div className="flex flex-col gap-2 md:col-span-2">
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
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <Label htmlFor='testing_type'>
                                    Keterangan Kondisi Alat
                                </Label>
                                <div>
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

export default LaboratoryEquipmentFormDialog
