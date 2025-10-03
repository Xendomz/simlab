import { StudyProgramSelectView } from '@/application/study-program/StudyProgramSelectView'
import { UserInputDTO } from '@/application/user/UserDTO'
import { UserView } from '@/application/user/UserView'
import { Combobox } from '@/presentation/components/custom/combobox'
import { Button } from '@/presentation/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { ScrollArea } from '@/presentation/components/ui/scroll-area'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/presentation/components/ui/select'
import { useValidationErrors } from '@/presentation/hooks/useValidationError'
import { ApiResponse } from '@/shared/Types'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface KepalaLabJurusanFormDialogProps {
    title: string,
    open: boolean,
    studyPrograms: StudyProgramSelectView[]
    data: UserView[],
    dataId: number | null,
    onOpenChange: (open: boolean) => void,
    handleSave: (data: any) => Promise<void>
}

const KepalaLabJurusanFormDialog: React.FC<KepalaLabJurusanFormDialogProps> = ({
    title,
    open,
    studyPrograms,
    data,
    dataId,
    onOpenChange,
    handleSave
}) => {
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
            const selectedKepalaLabJurusan = data.find((kepalaLabJurusan) => kepalaLabJurusan.id == dataId)
            if (selectedKepalaLabJurusan) {
                setFormData({
                    name: selectedKepalaLabJurusan.name,
                    email: selectedKepalaLabJurusan.email,
                    role: selectedKepalaLabJurusan.role,
                    study_program_id: selectedKepalaLabJurusan.studyProgram?.id ?? null,
                    identity_num: selectedKepalaLabJurusan.identityNum,
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
                                    Nama <span className="text-red-500">*</span>
                                </Label>
                                <div>
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
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor='identity_num'>
                                    NIP / NIPH
                                </Label>
                                <div>
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
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor='prodi_id'>
                                    Prodi <span className="text-red-500">*</span>
                                </Label>
                                <div>
                                    <Combobox
                                        options={studyPrograms}
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
                                <Label htmlFor='role'>
                                    Role <span className="text-red-500">*</span>
                                </Label>
                                <div>
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
                                                <SelectItem value="kepala_lab_terpadu">Kepala Lab Terpadu</SelectItem>
                                                <SelectItem value="kepala_lab_jurusan">Kepala Lab Jurusan</SelectItem>
                                                <SelectItem value="dosen">Dosen</SelectItem>
                                                <SelectItem value="koorprodi">Koorprodi</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {errors['role'] && (
                                        <p className="mt-1 text-xs italic text-red-500">{errors['role']}</p>
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

export default KepalaLabJurusanFormDialog
