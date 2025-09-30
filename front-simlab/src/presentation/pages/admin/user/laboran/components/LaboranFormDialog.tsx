import { UserInputDTO } from '@/application/user/UserDTO'
import { UserView } from '@/application/user/UserView'
import { Button } from '@/presentation/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { ScrollArea } from '@/presentation/components/ui/scroll-area'
import { useValidationErrors } from '@/presentation/hooks/useValidationError'
import { ApiResponse } from '@/shared/Types'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface LaboranFormDialogProps {
    title: string,
    open: boolean,
    data: UserView[],
    dataId: number | null,
    onOpenChange: (open: boolean) => void,
    handleSave: (data: any) => Promise<void>
}

const LaboranFormDialog: React.FC<LaboranFormDialogProps> = ({
    title,
    open,
    data,
    dataId,
    onOpenChange,
    handleSave
}) => {
    const defaultFormData: UserInputDTO = {
        name: null,
        email: null,
        role: 'laboran',
        study_program_id: null,
        identity_num: null,
        password: null
    }
    const [formData, setFormData] = useState<UserInputDTO>(defaultFormData);
    const { errors, setErrors, processErrors } = useValidationErrors()
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setErrors({})
        if (dataId) {
            const selectedLaboran = data.find((laboran) => laboran.id == dataId);
            if (selectedLaboran) {
                setFormData({
                    name: selectedLaboran.name,
                    email: selectedLaboran.email,
                    role: 'laboran',
                    study_program_id: selectedLaboran.studyProgram?.id ?? null,
                    identity_num: selectedLaboran.identityNum,
                    password: ''
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
            toast.error(error.message)
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
                                <Label htmlFor='email'>
                                    Email <span className="text-red-500">*</span>
                                </Label>
                                <div>
                                    <Input
                                        type='email'
                                        id='email'
                                        name='email'
                                        value={formData['email'] || ''}
                                        onChange={dataId ? undefined : handleChange}
                                        placeholder='Email'
                                        disabled={dataId ? true : false}
                                    />
                                    {errors['email'] && (
                                        <p className="mt-1 text-xs italic text-red-500">{errors['email']}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor='name'>
                                    Nama Petugas Laboran <span className="text-red-500">*</span>
                                </Label>
                                <div>
                                    <Input
                                        type='text'
                                        id='name'
                                        name='name'
                                        value={formData['name'] || ''}
                                        onChange={handleChange}
                                        placeholder='Nama Petugas Laboran'
                                    />
                                    {errors['name'] && (
                                        <p className="mt-1 text-xs italic text-red-500">{errors['name']}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor='password'>
                                    Password <span className="text-red-500">*</span>
                                </Label>
                                <div>
                                    <Input
                                        type='password'
                                        id='password'
                                        name='password'
                                        value={formData['password'] || ''}
                                        onChange={handleChange}
                                        placeholder='*****'
                                    />
                                    {errors['password'] && (
                                        <p className="mt-1 text-xs italic text-red-500">{errors['password']}</p>
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

export default LaboranFormDialog
