import { MajorSelectView } from '@/application/major/MajorSelectView';
import { StudyProgramInputDTO } from '@/application/study-program/StudyProgramDTO';
import { StudyProgramView } from '@/application/study-program/StudyProgramView';
import { Button } from '@/presentation/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';
import { useValidationErrors } from '@/presentation/hooks/useValidationError';
import { ApiResponse } from '@/shared/Types';
import React, { useEffect, useState } from 'react'

interface StudyProgramFormDialogProps {
    title: string,
    open: boolean,
    data: StudyProgramView[],
    majors: MajorSelectView[]
    dataId: number | null,
    onOpenChange: (open: boolean) => void,
    handleSave: (data: StudyProgramInputDTO) => Promise<void>
}

const StudyProgramFormDialog: React.FC<StudyProgramFormDialogProps> = ({
    title,
    open,
    data,
    majors,
    dataId,
    onOpenChange,
    handleSave
}) => {
    const defaultFormData: StudyProgramInputDTO = {
        major_id: null,
        name: ''
    }
    const [formData, setFormData] = useState<StudyProgramInputDTO>(defaultFormData);
    const { errors, setErrors, processErrors } = useValidationErrors()
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setErrors({})
    }, [open])

    useEffect(() => {
        if (dataId) {
            const studyPrograms = data.find((data: StudyProgramView) => data.id == dataId)
            setFormData({
                major_id: studyPrograms?.major?.id ?? null,
                name: studyPrograms?.name ?? ''
            })
        } else {
            setFormData(defaultFormData)
        }

    }, [dataId])

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
                <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor='major'>
                            Nama Jurusan <span className="text-red-500">*</span>
                        </Label>
                        <div>
                            <Select name='major_id' value={formData['major_id'] !== null ? String(formData['major_id']) : ''} onValueChange={(value) =>
                                handleChange({
                                    target: {
                                        name: 'major_id',
                                        value: value
                                    }
                                } as React.ChangeEvent<HTMLInputElement>)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Jurusan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Jurusan</SelectLabel>
                                        {majors?.map((option, index) => (
                                            <SelectItem key={index} value={option.id.toString()}>{option.name}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors['major_id'] && (
                                <p className="mt-1 text-xs italic text-red-500">{errors['major_id']}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor='name'>
                            Nama Prodi <span className="text-red-500">*</span>
                        </Label>
                        <div>
                            <Input
                                type='text'
                                id='name'
                                name='name'
                                value={formData['name'] || ''}
                                onChange={handleChange}
                                placeholder='Nama Prodi'
                            />
                            {errors['name'] && (
                                <p className="mt-1 text-xs italic text-red-500">{errors['name']}</p>
                            )}
                        </div>
                    </div>
                </form>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Tutup
                        </Button>
                    </DialogClose>
                    <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default StudyProgramFormDialog
