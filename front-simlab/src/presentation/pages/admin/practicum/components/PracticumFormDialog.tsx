import { PracticumInputDTO } from '@/application/practicum/PracticumDTO'
import { PracticumView } from '@/application/practicum/PracticumView'
import { StudyProgramSelectView } from '@/application/study-program/StudyProgramSelectView'
import { Combobox } from '@/presentation/components/custom/combobox'
import { Button } from '@/presentation/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { useValidationErrors } from '@/presentation/hooks/useValidationError'
import { ApiResponse } from '@/shared/Types'
import React, { useEffect, useState } from 'react'

interface PracticumFormDialogProps {
    title: string,
    open: boolean,
    data: PracticumView[],
    studyProgram: StudyProgramSelectView[]
    dataId: number | null,
    onOpenChange: (open: boolean) => void,
    handleSave: (data: any) => Promise<void>
}

const PracticumFormDialog: React.FC<PracticumFormDialogProps> = ({
    title,
    open,
    data,
    studyProgram,
    dataId,
    onOpenChange,
    handleSave
}) => {
    const defaultFormData: PracticumInputDTO = {
        code: '',
        name: '',
        study_program_id: null,
        sks: 0
    }
    const [formData, setFormData] = useState<PracticumInputDTO>(defaultFormData);
    const { errors, setErrors, processErrors } = useValidationErrors()
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setErrors({})
    }, [open])

    useEffect(() => {
        if (dataId) {
            const selectedPracticum = data.find((practicum) => practicum.id == dataId)
            if (selectedPracticum) {
                setFormData({
                    code: selectedPracticum.code,
                    name: selectedPracticum.name ?? '',
                    study_program_id: selectedPracticum.studyProgram?.id ?? null,
                    sks: selectedPracticum.sks ?? 0
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
                    <div className="flex flex-col gap-2">
                        <Label htmlFor='code'>
                            Kode Mata Kuliah <span className="text-red-500">*</span>
                        </Label>
                        <div>
                            <Input
                                type='text'
                                id='code'
                                name='code'
                                value={formData['code'] || ''}
                                onChange={handleChange}
                                placeholder='Kode Mata Kuliah'
                            />
                            {errors['code'] && (
                                <p className="mt-1 text-xs italic text-red-500">{errors['code']}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor='name'>
                            Nama Praktikum <span className="text-red-500">*</span>
                        </Label>
                        <div>
                            <Input
                                type='text'
                                id='name'
                                name='name'
                                value={formData['name'] || ''}
                                onChange={handleChange}
                                placeholder='Nama Praktikum'
                            />
                            {errors['name'] && (
                                <p className="mt-1 text-xs italic text-red-500">{errors['name']}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor='study_program_id'>
                            Nama Prodi <span className="text-red-500">*</span>
                        </Label>
                        <div>
                            <Combobox
                                options={studyProgram}
                                value={formData.study_program_id?.toString() || ''}
                                onChange={(val) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        study_program_id: val ? Number(val) : null
                                    }))
                                }}
                                placeholder="Pilih Prodi"
                                optionLabelKey='name'
                                optionValueKey='id'
                            />
                            {errors['study_program_id'] && (
                                <p className="mt-1 text-xs italic text-red-500">{errors['study_program_id']}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor='sks'>
                            SKS <span className="text-red-500">*</span>
                        </Label>
                        <div>
                            <Input
                                type='number'
                                id='sks'
                                name='sks'
                                value={formData['sks'] || ''}
                                onChange={handleChange}
                                placeholder='0'
                            />
                            {errors['sks'] && (
                                <p className="mt-1 text-xs italic text-red-500">{errors['sks']}</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Close
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

export default PracticumFormDialog
