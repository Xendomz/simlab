import { MajorInputDTO } from '@/application/major/MajorDTO';
import { MajorView } from '@/application/major/MajorView';
import { Button } from '@/presentation/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { useValidationErrors } from '@/presentation/hooks/useValidationError';
import { ApiResponse } from '@/shared/Types';
import React, { useEffect, useState } from 'react'
import { Combobox } from '@/presentation/components/custom/combobox';
import { FacultySelectView } from '@/application/faculty/FacultySelectView';

interface MajorFormDialogProps {
    title: string,
    open: boolean,
    data: MajorView[],
    faculties: FacultySelectView[]
    dataId: number | null,
    onOpenChange: (open: boolean) => void,
    handleSave: (data: MajorInputDTO) => Promise<void>
}

const MajorFormDialog: React.FC<MajorFormDialogProps> = ({
    title,
    open,
    data,
    dataId,
    faculties,
    onOpenChange,
    handleSave
}) => {
    const defaultFormData: MajorInputDTO = {
        faculty_id: null,
        code: '',
        name: ''
    }
    const [formData, setFormData] = useState<MajorInputDTO>(defaultFormData);
    const { errors, setErrors, processErrors } = useValidationErrors()
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setErrors({})
        if (dataId) {
            const selectedMajor = data.find((data: MajorView) => data.id == dataId)
            if (selectedMajor) {
                setFormData({
                    faculty_id: selectedMajor.faculty?.id ?? null,
                    code: selectedMajor.code,
                    name: selectedMajor.name,
                })
            }
        } else {
            setFormData(defaultFormData)
        }
    }, [open])

    const handleChange = (e: React.ChangeEvent) => {
        const { name, value } = e.target as HTMLInputElement;
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
                <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor='faculty_id'>
                            Nama Fakultas <span className="text-red-500">*</span>
                        </Label>
                        <div>
                            <Combobox
                                options={faculties}
                                value={formData.faculty_id?.toString() || ''}
                                onChange={(val) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        faculty_id: val ? Number(val) : null
                                    }))
                                }}
                                placeholder="Pilih Fakultas"
                                optionLabelKey='name'
                                optionValueKey='id'
                            />
                            {errors['faculty_id'] && (
                                <p className="mt-1 text-xs italic text-red-500">{errors['faculty_id']}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor='code'>
                            Kode Jurusan
                        </Label>
                        <div>
                            <Input
                                type='text'
                                id='code'
                                name='code'
                                value={formData['code'] || ''}
                                onChange={handleChange}
                                placeholder='Kode Jurusan'
                            />
                            {errors['code'] && (
                                <p className="mt-1 text-xs italic text-red-500">{errors['code']}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor='name'>
                            Nama Jurusan <span className="text-red-500">*</span>
                        </Label>
                        <div>
                            <Input
                                type='text'
                                id='name'
                                name='name'
                                value={formData['name'] || ''}
                                onChange={handleChange}
                                placeholder='Nama Jurusan'
                            />
                            {errors['name'] && (
                                <p className="mt-1 text-xs italic text-red-500">{errors['name']}</p>
                            )}
                        </div>
                    </div>
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

export default MajorFormDialog
