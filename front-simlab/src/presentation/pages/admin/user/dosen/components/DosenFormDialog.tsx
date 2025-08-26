import { StudyProgramView } from '@/application/study-program/StudyProgramView'
import { UserInputDTO } from '@/application/user/dto/UserDTO'
import { UserView } from '@/application/user/UserView'
import { Button } from '@/presentation/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/presentation/components/ui/select'
import { useValidationErrors } from '@/presentation/hooks/useValidationError'
import { ApiResponse } from '@/shared/Types'
import React, { useEffect, useState } from 'react'

interface DosenFormDialogProps {
    title: string,
    open: boolean,
    studyProgram: StudyProgramView[]
    data: any,
    dataId: number | null,
    onOpenChange: (open: boolean) => void,
    handleSave: (data: any) => Promise<void>
}

const DosenFormDialog: React.FC<DosenFormDialogProps> = ({
    title,
    open,
    studyProgram,
    data,
    dataId,
    onOpenChange,
    handleSave
}) => {
    const [formData, setFormData] = useState<UserInputDTO>({
        name: '',
        email: '',
        role: '',
        prodi_id: 0,
        identity_num: '',
        password: ''
    });
    const { errors, setErrors, processErrors } = useValidationErrors()
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setErrors({})
    }, [open])

    useEffect(() => {
        if (dataId) {
            const selectedData = data.find((data: UserView) => data.id == dataId)
            const dosenData = {
                name: selectedData.name,
                email: selectedData.email,
                role: selectedData.role,
                prodi_id: selectedData.studyProgramId,
                identity_num: selectedData.identity_num,
                password: ''
            }
            setFormData(dosenData)
        } else {
            setFormData({
                name: '',
                email: '',
                role: '',
                prodi_id: 0,
                identity_num: '',
                password: ''
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
                <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor='email'>
                            Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type='email'
                            id='email'
                            name='email'
                            value={formData['email'] || ''}
                            onChange={dataId ? undefined : handleChange}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-300`}
                            placeholder='Email'
                            disabled={dataId ? true : false}
                        />
                        {errors['email'] && (
                            <p className="mt-1 text-xs italic text-red-500">{errors['email']}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor='name'>
                            Nama <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type='text'
                            id='name'
                            name='name'
                            value={formData['name'] || ''}
                            onChange={handleChange}
                            placeholder='Nama Dosen'
                        />
                        {errors['name'] && (
                            <p className="mt-1 text-xs italic text-red-500">{errors['name']}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor='identity_num'>
                            NIP / NIPH
                        </Label>
                        <Input
                            type='text'
                            id='identity_num'
                            name='identity_num'
                            value={formData['identity_num'] || ''}
                            onChange={handleChange}
                            placeholder='NIP / NIPH'
                        />
                        {errors['identity_num'] && (
                            <p className="mt-1 text-xs italic text-red-500">{errors['name']}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor='prodi_id'>
                            Prodi <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            name='prodi_id'
                            value={formData['prodi_id'] ? String(formData['prodi_id']) : ''}
                            onValueChange={(value) =>
                                handleChange({
                                    target: {
                                        name: 'prodi_id',
                                        value: value
                                    }
                                } as React.ChangeEvent<HTMLSelectElement>)
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Program Studi" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Program Studi</SelectLabel>
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

                    <div className="flex flex-col gap-2">
                        <Label htmlFor='role'>
                            Role <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            name='role'
                            value={formData['role'] ? String(formData['role']) : ''}
                            onValueChange={(value) =>
                                handleChange({
                                    target: {
                                        name: 'role',
                                        value: value
                                    }
                                } as React.ChangeEvent<HTMLSelectElement>)
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Role</SelectLabel>
                                    <SelectItem value="Kepala Lab Terpadu">Kepala Lab Terpadu</SelectItem>
                                    <SelectItem value="Kepala Lab Unit">Kepala Lab Unit</SelectItem>
                                    <SelectItem value="Dosen">Dosen</SelectItem>
                                    <SelectItem value="Koorprodi">Koorprodi</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors['role'] && (
                            <p className="mt-1 text-xs italic text-red-500">{errors['role']}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor='password'>
                            Password <span className="text-red-500">*</span>
                        </Label>
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

export default DosenFormDialog
