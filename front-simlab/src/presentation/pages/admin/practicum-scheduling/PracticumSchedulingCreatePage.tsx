import { gsap } from 'gsap';
import { useAuth } from '@/application/hooks/useAuth'
import { useGSAP } from '@gsap/react'
import React, { useEffect, useRef, useState } from 'react'
import Header from '@/presentation/components/Header';
import { Label } from '@/presentation/components/ui/label';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { NavLink, useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Plus, Trash } from 'lucide-react';
import { useValidationErrors } from '@/presentation/hooks/useValidationError';
import { toast } from 'sonner';
import { ApiResponse } from '@/shared/Types';
import { Combobox } from '@/presentation/components/custom/combobox';
import { DateTimePicker } from '@/presentation/components/ui/datetime-picker';
import { usePracticumSchedulingForm } from './hooks/usePracticumSchedulingForm';
import { PracticumModuleSelectView } from '@/application/practicum-module/PracticumModuleSelectView';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/presentation/components/ui/table';
import { userRole } from '@/domain/User/UserRole';
import { usePracticumScheduling } from './context/PracticumSchedulingContext';
import { useDepedencies } from '@/presentation/contexts/useDepedencies';
import { useLaboratoryRoomSelect } from '../laboratory-room/hooks/useLaboratoryRoomSelect';
import { usePracticumSelect } from '../practicum/hooks/usePracticumSelect';
import { useUserSelect } from '../user/hooks/useUserSelect';


const PracticumSchedulingCreatePage = () => {
    const sectionRef = useRef<HTMLDivElement | null>(null)

    useGSAP(() => {
        if (!sectionRef.current) return

        const tl = gsap.timeline()
        tl.fromTo(sectionRef.current,
            {
                opacity: 0,
                y: 100
            },
            {
                opacity: 1,
                y: 0,
                duration: 1
            },
        )
    }, [])
    const { isHasDraftPracticum, refreshIsHasDraftPracticum } = usePracticumScheduling()
    const { user } = useAuth()
    const {
        formData,
        setFormData,
        handleChange,
        handleClassChange,
        handleAddClass,
        handleRemoveClass,
        handleAddSession,
        handleRemoveSession,
        updateSessionDateTime,
        getPracticumModule,
        updateSessionModule,
        duplicateClassByIndex
    } = usePracticumSchedulingForm()

    const { errors, processErrors } = useValidationErrors()
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const { laboratoryRooms } = useLaboratoryRoomSelect()
    const { practicums } = usePracticumSelect()
    const { users: lecturers } = useUserSelect({ role: userRole.Dosen })
    const { practicumSchedulingService } = useDepedencies()
    
    const [practicumModules, setPracticumModules] = useState<PracticumModuleSelectView[]>([])
    useEffect(() => {
        setPracticumModules(getPracticumModule(practicums))
    }, [formData.practicum_id])

    useEffect(() => {
        if (isHasDraftPracticum) {
            navigate('/404')
        }
    }, [isHasDraftPracticum])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const res = await practicumSchedulingService.create(formData);
            toast.success(res.message)
            navigate(`/panel/penjadwalan-praktikum/${res.data?.id}/manage`)
            refreshIsHasDraftPracticum()
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
        <>
            <Header title="Menu Penjadwalan Praktikum" />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0" ref={sectionRef}>
                <div className='flex justify-end'>
                    <NavLink to={'/panel/penjadwalan-praktikum'}>
                        <Button>
                            Kembali
                            <ArrowLeft />
                        </Button>
                    </NavLink>
                </div>
                <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Ajukan Peminjaman</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='flex flex-col gap-5'>
                                <div className='flex flex-col md:flex-row gap-5'>
                                    <div className="flex flex-col gap-2 w-full">
                                        <Label htmlFor='phone_number'>Nama Pemohon <span className="text-red-500">*</span></Label>
                                        <Input
                                            type='text'
                                            value={user?.name}
                                            disabled
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2 w-full">
                                        <Label htmlFor='phone_number'>Nomor Identitas <span className="text-red-500">*</span></Label>
                                        <Input
                                            type='text'
                                            value={user?.identityNum}
                                            disabled
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2 w-full md:col-span-2">
                                        <Label htmlFor='phone_number'>Program Studi  <span className="text-red-500">*</span></Label>
                                        <Input
                                            type='text'
                                            value={user?.studyProgram?.name}
                                            disabled
                                        />
                                    </div>

                                </div>
                                <div className='flex flex-col md:flex-row gap-5'>
                                    <div className="flex flex-col gap-2 w-full">
                                        <Label htmlFor='practicum_id'>Praktikum <span className="text-red-500">*</span></Label>
                                        <div>
                                            <Combobox
                                                options={practicums}
                                                value={formData.practicum_id?.toString() || ''}
                                                onChange={(val) => {
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        practicum_id: Number(val)
                                                    }))
                                                }}
                                                placeholder="Pilih praktikum"
                                                optionLabelKey='name'
                                                optionValueKey='id'
                                            />
                                            {errors.practicum_id && (
                                                <span className="text-xs text-red-500 mt-1">{errors.practicum_id}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 w-full">
                                        <Label htmlFor='phone_number'>Nomor HP <span className="text-red-500">*</span></Label>
                                        <div>
                                            <Input
                                                type='text'
                                                id='phone_number'
                                                name='phone_number'
                                                value={formData.phone_number}
                                                onChange={handleChange}
                                                placeholder='Nomor HP'
                                            />
                                            {errors.phone_number && (
                                                <span className="text-xs text-red-500 mt-1">{errors.phone_number}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    {formData.classes.map((classes, cidx) => (
                        <Card key={cidx}>
                            <CardHeader>
                                <CardTitle>{classes.name || 'Input Nama Kelas'}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-5'>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor='name'>Nama Kelas <span className="text-red-500">*</span></Label>
                                        <div>
                                            <Input
                                                type='text'
                                                id='name'
                                                name='name'
                                                value={classes.name}
                                                onChange={(e) => handleClassChange(e, cidx)}
                                                placeholder='Nama Kelas'
                                            />
                                            {errors[`classes.${cidx}.name`] && (
                                                <span className="text-xs text-red-500 mt-1">{errors[`classes.${cidx}.name`]}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor=''>Dosen Pengampu <span className="text-red-500">*</span></Label>
                                        <div>
                                            <Combobox
                                                options={lecturers}
                                                value={classes.lecturer_id?.toString() || ''}
                                                onChange={val => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        classes: prev.classes.map((cls, idx) =>
                                                            idx === cidx ? { ...cls, lecturer_id: Number(val) } : cls
                                                        )
                                                    }));
                                                }}
                                                placeholder="Pilih Dosen Pengampu"
                                                optionLabelKey='name'
                                                optionValueKey='id'
                                            />
                                            {errors[`classes.${cidx}.lecturer_id`] && (
                                                <span className="text-xs text-red-500 mt-1">{errors[`classes.${cidx}.lecturer_id`]}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor=''>Asisten Praktikum</Label>
                                        <div>
                                            <Input
                                                type='text'
                                                name='practicum_assistant'
                                                value={classes.practicum_assistant}
                                                onChange={(e) => handleClassChange(e, cidx)}
                                                placeholder='Asisten Praktikum'
                                            />
                                            {errors[`classes.${cidx}.practicum_assistant`] && (
                                                <span className="text-xs text-red-500 mt-1">{errors[`classes.${cidx}.practicum_assistant`]}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor=''>Ruangan Laboratorium <span className="text-red-500">*</span></Label>
                                        <div>
                                            <Combobox
                                                options={laboratoryRooms}
                                                value={classes.laboratory_room_id?.toString() || ''}
                                                onChange={val => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        classes: prev.classes.map((cls, idx) =>
                                                            idx === cidx ? { ...cls, laboratory_room_id: Number(val) } : cls
                                                        )
                                                    }));
                                                }}
                                                placeholder="Pilih Ruangan Laboratorium"
                                                optionLabelKey='name'
                                                optionValueKey='id'
                                            />
                                            {errors[`classes.${cidx}.laboratory_room_id`] && (
                                                <span className="text-xs text-red-500 mt-1">{errors[`classes.${cidx}.laboratory_room_id`]}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor=''>Total Partisipan <span className="text-red-500">*</span></Label>
                                        <div>
                                            <Input
                                                type='number'
                                                name='total_participant'
                                                value={classes.total_participant ?? ''}
                                                onChange={(e) => handleClassChange(e, cidx)}
                                                placeholder='Total Partisipan'
                                            />
                                            {errors[`classes.${cidx}.total_participant`] && (
                                                <span className="text-xs text-red-500 mt-1">{errors[`classes.${cidx}.total_participant`]}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor=''>Total Kelompok <span className="text-red-500">*</span></Label>
                                        <div>
                                            <Input
                                                type='text'
                                                name='total_group'
                                                value={classes.total_group ?? ''}
                                                onChange={(e) => handleClassChange(e, cidx)}
                                                placeholder='Total Kelompok'
                                            />
                                            {errors[`classes.${cidx}.total_group`] && (
                                                <span className="text-xs text-red-500 mt-1">{errors[`classes.${cidx}.total_group`]}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className='md:col-span-2 lg:col-span-3 border rounded-lg overflow-hidden'>
                                        <Table>
                                            <TableHeader className='bg-primary hover:bg-primary/80 group'>
                                                <TableRow>
                                                    <TableHead className='text-white group-hover:text-secondary'>Pertemuan</TableHead>
                                                    <TableHead className='text-white group-hover:text-secondary'>Modul</TableHead>
                                                    <TableHead className='text-white group-hover:text-secondary'>Waktu Praktikum</TableHead>
                                                    <TableHead className='text-white group-hover:text-secondary text-center'>Aksi</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {classes.sessions.map((session, sidx) => (
                                                    <TableRow key={sidx}>
                                                        <TableCell>Pertemuan - {sidx + 1}</TableCell>
                                                        <TableCell>
                                                            <div className='flex flex-col justify-start'>
                                                                {formData.practicum_id ? (
                                                                    <Combobox
                                                                        options={practicumModules}
                                                                        value={session.practicum_module_id?.toString() || ''}
                                                                        onChange={(val) => updateSessionModule(cidx, sidx, Number(val))}
                                                                        placeholder="Pilih Modul Praktikum"
                                                                        optionLabelKey='name'
                                                                        optionValueKey='id'
                                                                    />
                                                                ) : (
                                                                    <Button
                                                                        variant="outline"
                                                                        type='button'
                                                                        className='w-full justify-between font-normal' disabled
                                                                    >
                                                                        Harap pilih praktikum terlebih dahulu
                                                                    </Button>
                                                                )}
                                                                {errors[`classes.${cidx}.sessions.${sidx}.practicum_module_id`] && (
                                                                    <span className="text-xs text-red-500 mt-1">{errors[`classes.${cidx}.sessions.${sidx}.practicum_module_id`]}</span>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className='flex flex-col'>
                                                            <DateTimePicker
                                                                value={{
                                                                    date: session.start_time ? new Date(session.start_time) : undefined,
                                                                    startTime: session.start_time ? new Date(session.start_time).toTimeString().slice(0, 5) : '08:00',
                                                                    endTime: session.end_time ? new Date(session.end_time).toTimeString().slice(0, 5) : '17:00',
                                                                }}
                                                                onChange={({ date, startTime, endTime }) =>
                                                                    updateSessionDateTime(cidx, sidx, date, startTime, endTime)
                                                                }
                                                            />
                                                            {(errors[`classes.${cidx}.sessions.${sidx}.start_time`] || errors[`classes.${cidx}.sessions.${sidx}.end_time`]) && (
                                                                <span className="text-xs text-red-500 mt-1">
                                                                    {errors[`classes.${cidx}.sessions.${sidx}.start_time`] || errors[`classes.${cidx}.sessions.${sidx}.end_time`]}
                                                                </span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className='text-center'>
                                                            {classes.sessions.length > 1 && (
                                                                <Button type="button" variant="destructive" size="icon" onClick={() => handleRemoveSession(cidx, sidx)} title="Hapus Sesi"><Trash /></Button>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <div className='flex gap-3 items-center'>
                                        <Button type="button" variant="secondary" onClick={() => handleAddSession(cidx)}>Tambah Sesi <Plus /></Button>
                                        {formData.classes.length > 1 && (
                                            <Button type="button" variant="destructive" onClick={() => handleRemoveClass(cidx)} title="Hapus Kelas">Hapus Kelas<Trash /></Button>
                                        )}
                                        <Button type="button" variant="default" onClick={() => duplicateClassByIndex(cidx)} title="Duplikat">Duplicate<Copy /></Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    <div className='flex justify-end gap-3'>
                        <Button type='button' variant={'secondary'} onClick={handleAddClass}>Tambah Kelas <Plus /></Button>
                        <Button type='submit' disabled={isSubmitting}>{isSubmitting ? 'Menyimpan...' : 'Simpan'}</Button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default PracticumSchedulingCreatePage
