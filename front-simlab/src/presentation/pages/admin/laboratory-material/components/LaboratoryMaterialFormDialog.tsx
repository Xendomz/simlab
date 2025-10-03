import { LaboratoryMaterialInputDTO } from "@/application/laboratory-material/LaboratoryMaterialDTO"
import { LaboratoryMaterialView } from "@/application/laboratory-material/LaboratoryMaterialView"
import { LaboratoryRoomSelectView } from "@/application/laboratory-room/LaboratoryRoomSelectView"
import { Combobox } from "@/presentation/components/custom/combobox"
import { Button } from "@/presentation/components/ui/button"
import { Calendar } from "@/presentation/components/ui/calendar"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/presentation/components/ui/dialog"
import { Input } from "@/presentation/components/ui/input"
import { Label } from "@/presentation/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/presentation/components/ui/popover"
import { ScrollArea } from "@/presentation/components/ui/scroll-area"
import { Textarea } from "@/presentation/components/ui/textarea"
import { useValidationErrors } from "@/presentation/hooks/useValidationError"
import { ApiResponse } from "@/shared/Types"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

interface LaboratoryRoomFormDialogProps {
    title: string,
    open: boolean,
    laboratoryRooms: LaboratoryRoomSelectView[]
    data: LaboratoryMaterialView[],
    dataId: number | null,
    onOpenChange: (open: boolean) => void,
    handleSave: (data: any) => Promise<void>
}

import React, { useEffect, useState } from 'react'

const LaboratoryMaterialFormDialog: React.FC<LaboratoryRoomFormDialogProps> = ({
    title,
    open,
    data,
    laboratoryRooms,
    dataId,
    onOpenChange,
    handleSave
}) => {
    const defaultFormData: LaboratoryMaterialInputDTO = {
        code: '',
        laboratory_room_id: undefined,
        material_name: '',
        brand: '',
        stock: 0,
        unit: '',
        purchase_date: undefined,
        expiry_date: undefined,
        description: '',
        refill_date: undefined,
        student_price: null,
        lecturer_price: null,
        external_price: null
    }
    const [formData, setFormData] = useState<LaboratoryMaterialInputDTO>(defaultFormData);

    const { errors, setErrors, processErrors } = useValidationErrors()
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setErrors({})
        if (dataId) {
            const selectedLaboratoryMaterial = data.find((data: LaboratoryMaterialView) => data.id == dataId)
            if (selectedLaboratoryMaterial) {
                setFormData({
                    code: selectedLaboratoryMaterial?.code ?? '',
                    laboratory_room_id: selectedLaboratoryMaterial?.laboratoryRoom?.id,
                    material_name: selectedLaboratoryMaterial?.materialName ?? '',
                    brand: selectedLaboratoryMaterial?.brand ?? '',
                    stock: selectedLaboratoryMaterial?.stock ?? 0,
                    unit: selectedLaboratoryMaterial?.unit ?? '',
                    purchase_date: selectedLaboratoryMaterial?.purchaseDate ?? undefined,
                    expiry_date: selectedLaboratoryMaterial?.expiryDate ?? undefined,
                    description: selectedLaboratoryMaterial?.description ?? '',
                    refill_date: selectedLaboratoryMaterial?.refillDate ?? undefined,
                    student_price: selectedLaboratoryMaterial.studentPrice.amount,
                    lecturer_price: selectedLaboratoryMaterial.lecturerPrice.amount,
                    external_price: selectedLaboratoryMaterial.externalPrice.amount,
                })
            }

        } else {
            setFormData(defaultFormData)
        }
    }, [open])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { type, name, value } = e.target as HTMLInputElement;
        let newValue = value;
        if (type === "number") {
            if (newValue.length > 1 && newValue.startsWith('0')) {
                newValue = newValue.replace(/^0+/, '');
                if (newValue === '') newValue = '0';
            }
        }

        setFormData((prev) => ({ ...prev, [name]: newValue }));
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
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5" encType="multipart/form-data">
                    <ScrollArea className='h-full max-h-[70vh]'>
                        <div className="grid md:grid-cols-2 gap-x-2 gap-y-5 p-1">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor='testing_type'>
                                    Kode Bahan <span className="text-red-500">*</span>
                                </Label>
                                <div>
                                    <Input
                                        type='text'
                                        id='code'
                                        name='code'
                                        value={formData['code'] || ''}
                                        onChange={dataId ? undefined : handleChange}
                                        placeholder='Kode Bahan'
                                        disabled={dataId ? true : false}
                                    />
                                    {errors['code'] && (
                                        <p className="mt-1 text-xs italic text-red-500">{errors['code']}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor='testing_type'>
                                    Nama Bahan <span className="text-red-500">*</span>
                                </Label>
                                <div>
                                    <Input
                                        type='text'
                                        id='material_name'
                                        name='material_name'
                                        value={formData['material_name'] || ''}
                                        onChange={handleChange}
                                        placeholder='Nama Bahan'
                                    />
                                    {errors['material_name'] && (
                                        <p className="mt-1 text-xs italic text-red-500">{errors['material_name']}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor='testing_type'>
                                    Merek Bahan
                                </Label>
                                <div>
                                    <Input
                                        type='text'
                                        id='brand'
                                        name='brand'
                                        value={formData['brand'] || ''}
                                        onChange={handleChange}
                                        placeholder='Merek Bahan'
                                    />
                                    {errors['brand'] && (
                                        <p className="mt-1 text-xs italic text-red-500">{errors['brand']}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor='testing_type'>
                                    Stok Bahan <span className="text-red-500">*</span>
                                </Label>
                                <div>
                                    <Input
                                        type='number'
                                        id='stock'
                                        name='stock'
                                        value={formData['stock'] || ''}
                                        onChange={handleChange}
                                        placeholder='0'
                                    />
                                    {errors['stock'] && (
                                        <p className="mt-1 text-xs italic text-red-500">{errors['stock']}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor='testing_type'>
                                    Satuan Bahan <span className="text-red-500">*</span>
                                </Label>
                                <div>
                                    <Input
                                        type='text'
                                        id='unit'
                                        name='unit'
                                        value={formData['unit'] || ''}
                                        onChange={handleChange}
                                        placeholder='Satuan Bahan'
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
                                    Tanggal Beli Bahan <span className="text-red-500">*</span>
                                </Label>
                                <div>
                                    <Popover modal={true}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                data-empty={!formData['purchase_date']}
                                                className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal w-full"
                                            >
                                                <CalendarIcon />
                                                {formData['purchase_date'] ? format(formData['purchase_date'], "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={formData['purchase_date']} onSelect={(date: Date) => {
                                                setFormData({ ...formData, purchase_date: date })
                                            }} required />
                                        </PopoverContent>
                                    </Popover>
                                    {errors['purchase_date'] && (
                                        <p className="mt-1 text-xs italic text-red-500">{errors['purchase_date']}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor='testing_type'>
                                    Tanggal Kadaluarsa Bahan
                                </Label>
                                <div>
                                    <Popover modal={true}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                data-empty={!formData['expiry_date']}
                                                className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal w-full"
                                            >
                                                <CalendarIcon />
                                                {formData['expiry_date'] ? format(formData['expiry_date'], "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={formData['expiry_date']} onSelect={(date: Date) => setFormData({ ...formData, expiry_date: date })} required />
                                        </PopoverContent>
                                    </Popover>
                                    {errors['expiry_date'] && (
                                        <p className="mt-1 text-xs italic text-red-500">{errors['expiry_date']}</p>
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
                                    Keterangan Bahan
                                </Label>
                                <div>
                                    <Textarea
                                        name="description"
                                        id="description"
                                        onChange={handleChange}
                                        placeholder='Keterangan'
                                        value={formData['description'] || ''}
                                    >
                                    </Textarea>
                                    {errors['description'] && (
                                        <p className="mt-1 text-xs italic text-red-500">{errors['description']}</p>
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
                        <Button type="submit" onClick={handleSubmit}>
                            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default LaboratoryMaterialFormDialog
