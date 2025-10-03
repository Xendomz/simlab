import React, { useEffect, useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog'
import { useValidationErrors } from '@/presentation/hooks/useValidationError'
import { ApiResponse } from '@/shared/Types'
import { Button } from '@/presentation/components/ui/button'
import { AcademicYearView } from '@/application/academic-year/AcademicYearView'
import { AcademicYearInputDTO } from '@/application/academic-year/AcademicYearDTO'
import { Label } from '@/presentation/components/ui/label'
import { Input } from '@/presentation/components/ui/input'

interface AcademicYearFormDialogProps {
    title: string,
    open: boolean,
    data: AcademicYearView[]
    dataId: number | null,
    onOpenChange: (open: boolean) => void,
    handleSave: (data: AcademicYearInputDTO) => Promise<void>
}

const AcademicYearFormDialog: React.FC<AcademicYearFormDialogProps> = ({
    title,
    open,
    data,
    dataId,
    onOpenChange,
    handleSave
}) => {
    const defaultFormData = {
        name: ''
    }
    const [formData, setFormData] = useState<AcademicYearInputDTO>(defaultFormData);
    const { errors, setErrors, processErrors } = useValidationErrors()
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setErrors({})
    }, [open])

    useEffect(() => {
        if (dataId) {
            const academicYear = data.find((data: AcademicYearView) => data.id == dataId)
            setFormData({ name: academicYear?.name ?? '' })
        } else {
            setFormData(defaultFormData) // Add other required fields with default values here
        }
    }, [open])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                processErrors(error.errors)
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
                <form onSubmit={handleSubmit} className='flex flex-col gap-5' encType='multipart/form-data'>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor='name'>
                            Tahun Akademik <span className="text-red-500">*</span>
                        </Label>
                        <div>
                            <Input
                                type='text'
                                id='name'
                                name='name'
                                value={formData['name'] || ''}
                                onChange={handleChange}
                                placeholder='Tahun Akademik'
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

export default AcademicYearFormDialog
