import React, { useEffect, useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogDescription, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog'
import { useValidationErrors } from '@/presentation/hooks/useValidationError'
import { ApiResponse } from '@/shared/Types'
import { Button } from '@/presentation/components/ui/button'
import { UserView } from '@/application/user/UserView'
import { Label } from '@/presentation/components/ui/label'
import { Input } from '@/presentation/components/ui/input'
import { UserInputDTO } from '@/application/user/UserDTO'

interface AdminFormDialogProps {
    title: string,
    open: boolean,
    data: UserView[]
    dataId: number | null,
    onOpenChange: (open: boolean) => void,
    handleSave: (data: UserInputDTO) => Promise<void>
}

const AdminFormDialog: React.FC<AdminFormDialogProps> = ({ title, open, onOpenChange, data, dataId, handleSave }) => {
    const defaultFormData: UserInputDTO = {
        name: null,
        email: null,
        role: null,
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
            const selectedAdmin = data.find((admin) => admin.id, dataId)
            if (selectedAdmin) {
                setFormData({
                    name: selectedAdmin.name,
                    email: selectedAdmin.email,
                    password: '',
                    role: selectedAdmin.role,
                    study_program_id: null,
                    identity_num: null,
                })
            }
        } else {
            setFormData(defaultFormData)
        }
    }, [open])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            role: 'Admin',
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
                <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
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
                            Password
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
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Tutup
                            </Button>
                        </DialogClose>
                        <Button type="submit" onClick={handleSubmit}>
                            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default AdminFormDialog
