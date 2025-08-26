import { MajorInputDTO } from '@/application/dto/MajorDTO';
import { MajorView } from '@/application/major/MajorView';
import { Button } from '@/presentation/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { useValidationErrors } from '@/presentation/hooks/useValidationError';
import { ApiResponse } from '@/shared/Types';
import React, { useEffect, useState } from 'react'

interface MajorFormDialogProps {
    title: string,
    open: boolean,
    data: any
    dataId: number | null,
    onOpenChange: (open: boolean) => void,
    handleSave: (data: any) => Promise<void>
}

const MajorFormDialog: React.FC<MajorFormDialogProps> = ({
    title,
    open,
    data,
    dataId,
    onOpenChange,
    handleSave
}) => {
    const [formData, setFormData] = useState<MajorInputDTO>({
        name: '',
        major_code: ''
    });
    const { errors, setErrors, processErrors } = useValidationErrors()
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setErrors({})
    }, [open])

    useEffect(() => {
        if (dataId) {
            const selectedData = data.find((data: MajorView) => data.id == dataId)
            setFormData({
                name: selectedData.name,
                major_code: selectedData.majorCode
            })
        } else {
            setFormData({
                name: '',
                major_code: ''
            })
        }
    }, [dataId])

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
                        <Label htmlFor='testing_type'>
                            Kode Jurusan <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type='text'
                            id='major_code'
                            name='major_code'
                            value={formData['major_code'] || ''}
                            onChange={dataId ? undefined : handleChange}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-300`}
                            placeholder='Kode Jurusan'
                            disabled={dataId ? true : false}
                        />
                        {errors['major_code'] && (
                            <p className="mt-1 text-xs italic text-red-500">{errors['major_code']}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor='testing_type'>
                            Nama Jurusan <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type='text'
                            id='name'
                            name='name'
                            value={formData['name'] || ''}
                            onChange={handleChange}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            placeholder='Nama Jurusan'
                        />
                        {errors['name'] && (
                            <p className="mt-1 text-xs italic text-red-500">{errors['name']}</p>
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

export default MajorFormDialog
