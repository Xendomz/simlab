import { TestingTypeInputDTO } from '@/application/testing-type/dtos/TestingTypeDTO';
import { TestingTypeView } from '@/application/testing-type/TestingTypeView';
import { Button } from '@/presentation/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { ScrollArea } from '@/presentation/components/ui/scroll-area';
import { useValidationErrors } from '@/presentation/hooks/useValidationError';
import { ApiResponse } from '@/shared/Types';
import React, { useEffect, useState } from 'react'

interface TestingTypeFormDialogProps {
    title: string,
    open: boolean,
    data: TestingTypeView[]
    dataId: number | null,
    onOpenChange: (open: boolean) => void,
    handleSave: (data: any) => Promise<void>
}

const TestingTypeFormDialog: React.FC<TestingTypeFormDialogProps> = ({
    title,
    open,
    data,
    dataId,
    onOpenChange,
    handleSave
}) => {
    const defaultFormData: TestingTypeInputDTO = {
        name: '',
        unit: '',
        student_price: null,
        lecturer_price: null,
        external_price: null
    }

    const [formData, setFormData] = useState<TestingTypeInputDTO>(defaultFormData);
    const { errors, setErrors, processErrors } = useValidationErrors()
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setErrors({})
        if (dataId) {
            const testingType = data.find((data: TestingTypeView) => data.id == dataId)
            setFormData({
                name: testingType?.name ?? '',
                unit: testingType?.unit ?? '',
                student_price: testingType?.studentPrice.amount ?? null,
                lecturer_price: testingType?.lecturerPrice.amount ?? null,
                external_price: testingType?.externalPrice.amount ?? null
            })
        } else {
            setFormData(defaultFormData)
        }
    }, [open])

    const handleChange = (e: React.ChangeEvent) => {
        const { type, name, value } = e.target as HTMLInputElement;
        let newValue = value;
        if (type === "number") {
            if (newValue.length > 1 && newValue.startsWith('0')) {
                newValue = newValue.replace(/^0+/, '');
                if (newValue === '') newValue = '0';
            }
        }
        setFormData(prev => ({
            ...prev,
            [name]: newValue
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
                        <div className='flex flex-col gap-5 p-1'>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor='name'>
                                    Jenis Pengujian <span className="text-red-500">*</span>
                                </Label>
                                <div>
                                    <Input
                                        type='text'
                                        id='name'
                                        name='name'
                                        value={formData['name'] || ''}
                                        onChange={handleChange}
                                        placeholder='Jenis Pengujian'
                                    />
                                    {errors['name'] && (
                                        <p className="mt-1 text-xs italic text-red-500">{errors['name']}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor='unit'>
                                    Satuan Pengujian <span className="text-red-500">*</span>
                                </Label>
                                <div>
                                    <Input
                                        type='text'
                                        id='unit'
                                        name='unit'
                                        value={formData['unit'] || ''}
                                        onChange={handleChange}
                                        placeholder='Satuan Pengujian'
                                    />
                                    {errors['unit'] && (
                                        <p className="mt-1 text-xs italic text-red-500">{errors['unit']}</p>
                                    )}
                                </div>
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

export default TestingTypeFormDialog
