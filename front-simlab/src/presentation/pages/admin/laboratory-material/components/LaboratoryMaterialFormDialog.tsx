import { LaboratoryMaterialInputDTO } from "@/application/laboratory-material/dto/LaboratoryMaterialDTO"
import { LaboratoryMaterialView } from "@/application/laboratory-material/LaboratoryMaterialView"
import { LaboratoryRoomView } from "@/application/laboratory-room/LaboratoryRoomView"
import { Button } from "@/presentation/components/ui/button"
import { Calendar } from "@/presentation/components/ui/calendar"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/presentation/components/ui/dialog"
import { Input } from "@/presentation/components/ui/input"
import { Label } from "@/presentation/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/presentation/components/ui/popover"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/presentation/components/ui/select"
import { Textarea } from "@/presentation/components/ui/textarea"
import { useValidationErrors } from "@/presentation/hooks/useValidationError"
import { ApiResponse } from "@/shared/Types"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

interface LaboratoryRoomFormDialogProps {
    title: string,
    open: boolean,
    laboratoryRoom: LaboratoryRoomView[]
    data: any,
    dataId: number | null,
    onOpenChange: (open: boolean) => void,
    handleSave: (data: any) => Promise<void>
}

import React, { useEffect, useState } from 'react'

const LaboratoryMaterialFormDialog: React.FC<LaboratoryRoomFormDialogProps> = ({
    title,
    open,
    data,
    laboratoryRoom,
    dataId,
    onOpenChange,
    handleSave
}) => {
    const [formData, setFormData] = useState<LaboratoryMaterialInputDTO>({
        code: '',
        ruangan_laboratorium_id: undefined,
        material_name: '',
        brand: '',
        stock: 0,
        unit: '',
        purchase_date: undefined,
        expiry_date: undefined,
        description: '',
        refill_date: undefined
    });

    const { errors, setErrors, processErrors } = useValidationErrors()
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setErrors({})
    }, [open])

    useEffect(() => {
        if (dataId) {
            const selectedData = data.find((data: LaboratoryMaterialView) => data.id == dataId)
            setFormData({
                code: selectedData.code,
                ruangan_laboratorium_id: selectedData.laboratoryRoomId,
                material_name: selectedData.materialName,
                brand: selectedData.brand,
                stock: selectedData.stock,
                unit: selectedData.unit,
                purchase_date: selectedData.purchaseDate,
                expiry_date: selectedData.expiryDate,
                description: selectedData.description,
                refill_date: selectedData.refillDate
            })

        } else {
            setFormData({
                code: '',
                ruangan_laboratorium_id: undefined,
                material_name: '',
                brand: '',
                stock: 0,
                unit: '',
                purchase_date: undefined,
                expiry_date: undefined,
                description: '',
                refill_date: undefined
            })
        }
    }, [dataId])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));
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
                <form onSubmit={handleSubmit} className='grid md:grid-cols-2 gap-x-5 gap-y-2 overflow-y-auto px-6 pb-6' encType="multipart/form-data">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor='testing_type'>
                            Kode Bahan <span className="text-red-500">*</span>
                        </Label>
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
                    <div className="flex flex-col gap-2">
                        <Label htmlFor='testing_type'>
                            Nama Bahan <span className="text-red-500">*</span>
                        </Label>
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
                    <div className="flex flex-col gap-2">
                        <Label htmlFor='testing_type'>
                            Merek Bahan
                        </Label>
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
                    <div className="flex flex-col gap-2">
                        <Label htmlFor='testing_type'>
                            Stok Bahan <span className="text-red-500">*</span>
                        </Label>
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
                    <div className="flex flex-col gap-2">
                        <Label htmlFor='testing_type'>
                            Satuan Bahan <span className="text-red-500">*</span>
                        </Label>
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
                            Tanggal Beli Bahan <span className="text-red-500">*</span>
                        </Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    data-empty={!formData['purchase_date']}
                                    className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal"
                                >
                                    <CalendarIcon />
                                    {formData['purchase_date'] ? format(formData['purchase_date'], "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={formData['purchase_date']} onSelect={(date: Date) => setFormData({ ...formData, purchase_date: date })} required />
                            </PopoverContent>
                        </Popover>
                        {errors['purchase_date'] && (
                            <p className="mt-1 text-xs italic text-red-500">{errors['purchase_date']}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor='testing_type'>
                            Tanggal Kadaluarsa Bahan
                        </Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    data-empty={!formData['expiry_date']}
                                    className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal"
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

                    <div className="flex flex-col gap-2 md:col-span-2">
                        <Label className="block mb-2 text-sm font-bold text-gray-700" htmlFor='testing_type'>
                            Keterangan Bahan
                        </Label>
                        <Textarea
                            name="description"
                            id="description"
                            onChange={handleChange}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            placeholder='Keterangan'
                            value={formData['description'] || ''}
                        >
                        </Textarea>
                        {errors['description'] && (
                            <p className="mt-1 text-xs italic text-red-500">{errors['description']}</p>
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

export default LaboratoryMaterialFormDialog
