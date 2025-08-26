import { PracticalWorkInputDTO } from '@/application/practical-work/dto/PracticalWorkDTO'
import { PracticalWorkView } from '@/application/practical-work/PracticalWorkView'
import { StudyProgramView } from '@/application/study-program/StudyProgramView'
import { Button } from '@/presentation/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/presentation/components/ui/select'
import { useValidationErrors } from '@/presentation/hooks/useValidationError'
import { ApiResponse } from '@/shared/Types'
import React, { useEffect, useState } from 'react'

interface PracticalWorkFormDialogProps {
    title: string,
    open: boolean,
    data: any,
    studyProgram: StudyProgramView[]
    dataId: number | null,
    onOpenChange: (open: boolean) => void,
    handleSave: (data: any) => Promise<void>
}

const PracticalWorkFormDialog: React.FC<PracticalWorkFormDialogProps> = ({
    title,
    open,
    data,
    studyProgram,
    dataId,
    onOpenChange,
    handleSave
}) => {
    const [formData, setFormData] = useState<PracticalWorkInputDTO>({
        name: '',
        prodi_id: null,
        sks: 0
    });
    const { errors, setErrors, processErrors } = useValidationErrors()
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setErrors({})
    }, [open])

    useEffect(() => {
        if (dataId) {
            const selectedData = data.find((data: PracticalWorkView) => data.id == dataId)

            setFormData({
                name: selectedData.name,
                prodi_id: selectedData.studyProgramId,
                sks: selectedData.sks
            })
        } else {
            setFormData({
                name: '',
                prodi_id: null,
                sks: 0
            })
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
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor='name'>
                            Nama Praktikum <span className="text-red-500">*</span>
                        </label>
                        <input
                            type='text'
                            id='name'
                            name='name'
                            value={formData['name'] || ''}
                            onChange={handleChange}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            placeholder='Nama Praktikum'
                        />
                        {errors['name'] && (
                            <p className="mt-1 text-xs italic text-red-500">{errors['name']}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor='prodi_id'>
                            Nama Prodi <span className="text-red-500">*</span>
                        </label>
                        <Select name='prodi_id' value={formData['prodi_id'] ? String(formData['prodi_id']) : ''} onValueChange={(value) =>
                            handleChange({
                                target: {
                                    name: 'prodi_id',
                                    value: value
                                }
                            } as React.ChangeEvent<HTMLSelectElement>)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Prodi" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Prodi</SelectLabel>
                                    {studyProgram?.map((option) => (
                                        <SelectItem key={option.id} value={option.id.toString()}>{option.name}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors['prodi_id'] && (
                            <p className="mt-1 text-xs italic text-red-500">{errors['prodi_id']}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor='sks'>
                            SKS <span className="text-red-500">*</span>
                        </label>
                        <input
                            type='number'
                            id='sks'
                            name='sks'
                            value={formData['sks'] || ''}
                            onChange={handleChange}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            placeholder='0'
                        />
                        {errors['sks'] && (
                            <p className="mt-1 text-xs italic text-red-500">{errors['sks']}</p>
                        )}
                    </div>
                </form>
                <DialogFooter>
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

export default PracticalWorkFormDialog
