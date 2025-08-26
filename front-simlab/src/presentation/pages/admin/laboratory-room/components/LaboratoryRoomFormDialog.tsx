import { LaboratoryRoomInputDTO } from '@/application/laboratory-room/dto/LaboratoryRoomDTO';
import { LaboratoryRoomView } from '@/application/laboratory-room/LaboratoryRoomView';
import { UserView } from '@/application/user/UserView';
import { Button } from '@/presentation/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';
import { useValidationErrors } from '@/presentation/hooks/useValidationError';
import { ApiResponse } from '@/shared/Types';
import React, { useEffect, useState } from 'react'

interface LaboratoryRoomFormDialogProps {
    title: string,
    open: boolean,
    laboran: UserView[]
    data: any,
    dataId: number | null,
    onOpenChange: (open: boolean) => void,
    handleSave: (data: any) => Promise<void>
}

const LaboratoryRoomFormDialog: React.FC<LaboratoryRoomFormDialogProps> = ({
    title,
    open,
    laboran,
    data,
    dataId,
    onOpenChange,
    handleSave
}) => {
    const [formData, setFormData] = useState<LaboratoryRoomInputDTO>({
        name: '',
        floor: '',
        user_id: null
    });
    const { errors, setErrors, processErrors } = useValidationErrors()
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setErrors({})
    }, [open])

    useEffect(() => {
        if (dataId) {
            const selectedData = data.find((data: LaboratoryRoomView) => data.id == dataId)

            setFormData({
                name: selectedData.name,
                floor: selectedData.floor,
                user_id: selectedData.userId
            })
        } else {
            setFormData({
                name: '',
                floor: '',
                user_id: null
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
                            Nama Ruangan <span className="text-red-500">*</span>
                        </label>
                        <input
                            type='text'
                            id='name'
                            name='name'
                            value={formData['name'] || ''}
                            onChange={handleChange}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            placeholder='Nama Ruangan'
                        />
                        {errors['name'] && (
                            <p className="mt-1 text-xs italic text-red-500">{errors['name']}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor='floor'>
                            Ruangan <span className="text-red-500">*</span>
                        </label>
                        <Select name='floor' value={formData['floor']} onValueChange={(value) =>
                            handleChange({
                                target: {
                                    name: 'floor',
                                    value: value
                                }
                            } as React.ChangeEvent<HTMLInputElement>)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Lantai" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Lantai</SelectLabel>
                                    <SelectItem value="Lantai 1">Lantai 1</SelectItem>
                                    <SelectItem value="Lantai 2">Lantai 2</SelectItem>
                                    <SelectItem value="Lantai 3">Lantai 3</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors['floor'] && (
                            <p className="mt-1 text-xs italic text-red-500">{errors['floor']}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor='user'>
                            Petugas Laboran <span className="text-red-500">*</span>
                        </label>
                        <Select name='user_id' value={formData['user_id'] !== null ? String(formData['user_id']) : ''} onValueChange={(value) =>
                            handleChange({
                                target: {
                                    name: 'user_id',
                                    value: value
                                }
                            } as React.ChangeEvent<HTMLInputElement>)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Laboran" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Laboran</SelectLabel>
                                    {laboran?.map((option) => (
                                        <SelectItem key={option.id} value={option.id.toString()}>{ option.name }</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors['user_id'] && (
                            <p className="mt-1 text-xs italic text-red-500">{errors['user_id']}</p>
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

export default LaboratoryRoomFormDialog
