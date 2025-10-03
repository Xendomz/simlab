import DatePickerButton from '@/presentation/components/custom/DatePickerButton';
import { gsap } from 'gsap';
import { useAuth } from '@/application/hooks/useAuth'
import { useGSAP } from '@gsap/react'
import React, { useEffect, useRef, useState } from 'react'
import Header from '@/presentation/components/Header';
// import { useLaboratoryRoom } from '@/application/laboratory-room/hooks/useLaboratoryRoom';
import { usePracticumScheduling } from '@/application/practicum-scheduling/hooks/usePracticumScheduling';
import { PracticumSchedulingInputDTO } from '@/application/practicum-scheduling/dto/PracticumSchedulingDTO';
import { Label } from '@/presentation/components/ui/label';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import TimePicker from '@/presentation/components/custom/TimePicker';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { NavLink, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash } from 'lucide-react';
import { useValidationErrors } from '@/presentation/hooks/useValidationError';
import { toast } from 'sonner';
import { ApiResponse } from '@/shared/Types';
import { Combobox } from '@/presentation/components/custom/combobox';
import { LaboratoryRoomView } from '@/application/laboratory-room/LaboratoryRoomView';
import { LaboratoryRoomService } from '@/application/laboratory-room/LaboratoryRoomService';
import { LaboratoryRoomSelectView } from '@/application/laboratory-room/LaboratoryRoomSelectView';
import { PracticumService } from '@/application/practicum/PracticumService';
import { PracticumSelectView } from '@/application/practicum/PracticumSelectView';


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

    const { user } = useAuth()

    const [formData, setFormData] = useState<PracticumSchedulingInputDTO>({
        praktikum_id: null,
        ruangan_laboratorium_id: null,
        phone_number: "",
        groups: [
            {
                group_name: "",
                practicum_assistant: "",
                practicum_session: "",
                start_time: undefined,
                end_time: undefined,
                total_participant: 0
            }
        ]
    })

    // Tambahkan baris kelompok baru ke tabel
    const handleAddGroup = () => {
        // Definisikan struktur default untuk satu kelompok praktikum
        const newGroup = {
            group_name: "",
            practicum_assistant: "",
            practicum_session: "",
            start_time: undefined,
            end_time: undefined,
            total_participant: 0
        };

        // Tambahkan kelompok baru ke array groups di formData
        setFormData(prevFormData => ({
            ...prevFormData,
            groups: [
                ...prevFormData.groups,
                newGroup
            ]
        }));
    }

    const handleRemoveGroup = (idx: number) => {
        setFormData(f => ({
            ...f,
            groups: f.groups.filter((_, i) => i !== idx)
        }))
    }

    const { errors, processErrors } = useValidationErrors()
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const laboratoryRoomService = new LaboratoryRoomService()
    const [laboratoryRooms, setLaboratoryRooms] = useState<LaboratoryRoomSelectView[]>([])
    const getLaboratoryRooms = async () => {
        const response = await laboratoryRoomService.getDataForSelect()
        setLaboratoryRooms(response.data ?? [])
    }

    const practicumService = new PracticumService()
    const [practicums, setPracticums] = useState<PracticumSelectView[]>([])
    const getPracticums = async () => {
        const response = await practicumService.getDataForSelect()
        setPracticums(response.data ?? [])
    }

    useEffect(() => {
        getPracticums()
        getLaboratoryRooms()
    }, [])

    const {
        create,
    } = usePracticumScheduling({})

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
            const res = await create(formData);
            toast.success(res.message)
            navigate(`/panel/penjadwalan-praktikum/${res.data?.id}/manage`)
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
        <>
            <Header title="Menu Penjadwalan Praktikum" />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0" ref={sectionRef}>
                <Card>
                    <CardHeader>
                        <CardTitle>Ajukan Peminjaman</CardTitle>
                        <CardAction>
                            <NavLink to={'/panel/penjadwalan-praktikum'}>
                                <Button>
                                    Kembali
                                    <ArrowLeft />
                                </Button>
                            </NavLink>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <form className='grid md:grid-cols-2 gap-x-5 gap-y-4' onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor='phone_number'>Nama Peminjam <span className="text-red-500">*</span></Label>
                                <Input
                                    type='text'
                                    value={user?.name}
                                    disabled
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor='phone_number'>Nomo Identitas <span className="text-red-500">*</span></Label>
                                <Input
                                    type='text'
                                    value={user?.identityNum}
                                    disabled
                                />
                            </div>
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <Label htmlFor='phone_number'>Program Studi  <span className="text-red-500">*</span></Label>
                                <Input
                                    type='text'
                                    value={user?.studyProgram?.name}
                                    disabled
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor='praktikum_id'>Praktikum <span className="text-red-500">*</span></Label>
                                <Combobox
                                    options={practicums}
                                    value={formData.praktikum_id?.toString() || ''}
                                    onChange={(val) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            praktikum_id: Number(val)
                                        }))
                                    }}
                                    placeholder="Pilih praktikum"
                                    optionLabelKey='name'
                                    optionValueKey='id'
                                />
                                {errors.praktikum_id && (
                                    <span className="text-xs text-red-500 mt-1">{errors.praktikum_id}</span>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor='ruangan_laboratorium_id'>Ruangan Laboratorium <span className="text-red-500">*</span></Label>
                                <Combobox
                                    options={laboratoryRooms}
                                    value={formData.ruangan_laboratorium_id?.toString() || ''}
                                    onChange={(val) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            ruangan_laboratorium_id: Number(val)
                                        }))
                                    }}
                                    placeholder="Pilih ruangan"
                                    optionLabelKey='name'
                                    optionValueKey='id'
                                />
                                {errors.ruangan_laboratorium_id && (
                                    <span className="text-xs text-red-500 mt-1">{errors.ruangan_laboratorium_id}</span>
                                )}
                            </div>
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <Label htmlFor='phone_number'>Nomor HP <span className="text-red-500">*</span></Label>
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
                            {/* Groups input - dynamic multi-form */}
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <Label>Kelompok Praktikum <span className="text-red-500">*</span></Label>
                                <div className="overflow-x-auto w-full">
                                    <table className="min-w-fit border text-sm rounded-lg w-full">
                                        <thead>
                                            <tr className="bg-muted">
                                                <th className="border px-2 py-1 min-w-[200px]">Nama Kelompok</th>
                                                <th className="border px-2 py-1 min-w-[200px]">Asisten Praktikum</th>
                                                <th className="border px-2 py-1 min-w-[200px]">Sesi Praktikum</th>
                                                <th className="border px-2 py-1 min-w-[180px]">Waktu Mulai & Selesai</th>
                                                <th className="border px-2 py-1 min-w-[140px]">Jumlah Peserta</th>
                                                <th className="border px-2 py-1 min-w-[100px]">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {formData.groups.map((group, idx) => (
                                                <tr key={idx}>
                                                    <td className="border px-2 py-1 min-w-[200px]">
                                                        <Input
                                                            type='text'
                                                            name='group_name'
                                                            value={group.group_name}
                                                            onChange={e => {
                                                                const newValue = e.target.value;
                                                                setFormData(prevFormData => {
                                                                    // Update hanya group_name pada index yang sesuai
                                                                    const updatedGroups = prevFormData.groups.map((g, i) =>
                                                                        i === idx ? { ...g, group_name: newValue } : g
                                                                    );
                                                                    return {
                                                                        ...prevFormData,
                                                                        groups: updatedGroups
                                                                    };
                                                                });
                                                            }}
                                                            placeholder='Nama Kelompok'
                                                        />
                                                        {errors[`groups.${idx}.group_name`] && (
                                                            <span className="text-xs text-red-500 mt-1">{errors[`groups.${idx}.group_name`]}</span>
                                                        )}
                                                    </td>
                                                    <td className="border px-2 py-1 min-w-[200px]">
                                                        <Input
                                                            type='text'
                                                            name='practicum_assistant'
                                                            value={group.practicum_assistant}
                                                            onChange={e => {
                                                                const newValue = e.target.value;
                                                                setFormData(prevFormData => {
                                                                    // Update hanya practicum_assistant pada index yang sesuai
                                                                    const updatedGroups = prevFormData.groups.map((g, i) =>
                                                                        i === idx ? { ...g, practicum_assistant: newValue } : g
                                                                    );
                                                                    return {
                                                                        ...prevFormData,
                                                                        groups: updatedGroups
                                                                    };
                                                                });
                                                            }}
                                                            placeholder='Asisten Praktikum'
                                                        />
                                                        {errors[`groups.${idx}.practicum_assistant`] && (
                                                            <span className="text-xs text-red-500 mt-1">{errors[`groups.${idx}.practicum_assistant`]}</span>
                                                        )}
                                                    </td>
                                                    <td className="border px-2 py-1 min-w-[200px]">
                                                        <Input
                                                            type='text'
                                                            name='practicum_session'
                                                            value={group.practicum_session}
                                                            onChange={e => {
                                                                const newValue = e.target.value;
                                                                setFormData(prevFormData => {
                                                                    // Update hanya practicum_session pada index yang sesuai
                                                                    const updatedGroups = prevFormData.groups.map((g, i) =>
                                                                        i === idx ? { ...g, practicum_session: newValue } : g
                                                                    );
                                                                    return {
                                                                        ...prevFormData,
                                                                        groups: updatedGroups
                                                                    };
                                                                });
                                                            }}
                                                            placeholder='Sesi Praktikum'
                                                        />
                                                        {errors[`groups.${idx}.practicum_session`] && (
                                                            <span className="text-xs text-red-500 mt-1">{errors[`groups.${idx}.practicum_session`]}</span>
                                                        )}
                                                    </td>
                                                    <td className="border px-2 py-1 min-w-[180px]">
                                                        <div className="flex flex-col gap-1">
                                                            {/* Date Picker (shadcn/ui style) */}
                                                            <div className="w-full">
                                                                <DatePickerButton
                                                                    date={group.start_time ? new Date(group.start_time) : undefined}
                                                                    onChange={date => {
                                                                        if (!date) return;
                                                                        setFormData(prevFormData => {
                                                                            const updatedGroups = prevFormData.groups.map((g, i) => {
                                                                                if (i === idx) {
                                                                                    // Set both start_time and end_time to the selected date, keep time if already set
                                                                                    const startTime = g.start_time ? new Date(g.start_time) : date;
                                                                                    const endTime = g.end_time ? new Date(g.end_time) : date;
                                                                                    startTime.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                                                                                    endTime.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                                                                                    return {
                                                                                        ...g,
                                                                                        start_time: startTime,
                                                                                        end_time: endTime
                                                                                    };
                                                                                }
                                                                                return g;
                                                                            });
                                                                            return {
                                                                                ...prevFormData,
                                                                                groups: updatedGroups
                                                                            };
                                                                        });
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="flex gap-2 mt-1 justify-center">
                                                                {/* Time Picker for Start Time */}
                                                                <TimePicker
                                                                    id={`start_time_${idx}`}
                                                                    value={group.start_time ? new Date(group.start_time).toTimeString().slice(0, 8) : "08:00:00"}
                                                                    onChange={val => {
                                                                        setFormData(prevFormData => {
                                                                            const [h, m, s] = val.split(":").map(Number);
                                                                            const updatedGroups = prevFormData.groups.map((g, i) => {
                                                                                if (i === idx) {
                                                                                    const date = g.start_time ? new Date(g.start_time) : new Date();
                                                                                    date.setHours(h, m, s, 0);
                                                                                    return { ...g, start_time: date };
                                                                                }
                                                                                return g;
                                                                            });
                                                                            return { ...prevFormData, groups: updatedGroups };
                                                                        });
                                                                    }}
                                                                />
                                                                {/* Time Picker for End Time */}
                                                                <TimePicker
                                                                    id={`end_time_${idx}`}
                                                                    value={group.end_time ? new Date(group.end_time).toTimeString().slice(0, 8) : "17:00:00"}
                                                                    onChange={val => {
                                                                        setFormData(prevFormData => {
                                                                            const [h, m, s] = val.split(":").map(Number);
                                                                            const updatedGroups = prevFormData.groups.map((g, i) => {
                                                                                if (i === idx) {
                                                                                    const date = g.end_time ? new Date(g.end_time) : new Date();
                                                                                    date.setHours(h, m, s, 0);
                                                                                    return { ...g, end_time: date };
                                                                                }
                                                                                return g;
                                                                            });
                                                                            return { ...prevFormData, groups: updatedGroups };
                                                                        });
                                                                    }}
                                                                />
                                                            </div>
                                                            {/* Error for start_time or end_time */}
                                                            {(errors[`groups.${idx}.start_time`] || errors[`groups.${idx}.end_time`]) && (
                                                                <span className="text-xs text-red-500 mt-1">
                                                                    {errors[`groups.${idx}.start_time`] || errors[`groups.${idx}.end_time`]}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="border px-2 py-1 min-w-[140px]">
                                                        <Input
                                                            type='number'
                                                            name='total_participant'
                                                            value={group.total_participant}
                                                            onChange={e => {
                                                                const newValue = Number(e.target.value);
                                                                setFormData(prevFormData => {
                                                                    // Update hanya total_participant pada index yang sesuai
                                                                    const updatedGroups = prevFormData.groups.map((g, i) =>
                                                                        i === idx ? { ...g, total_participant: newValue } : g
                                                                    );
                                                                    return {
                                                                        ...prevFormData,
                                                                        groups: updatedGroups
                                                                    };
                                                                });
                                                            }}
                                                            placeholder='Jumlah Peserta'
                                                        />
                                                        {errors[`groups.${idx}.total_participant`] && (
                                                            <span className="text-xs text-red-500 mt-1">{errors[`groups.${idx}.total_participant`]}</span>
                                                        )}
                                                    </td>
                                                    <td className="border px-2 py-1 min-w-[100px] text-center">
                                                        {formData.groups.length > 1 && (
                                                            <Button type="button" variant="destructive" size="icon" onClick={() => handleRemoveGroup(idx)} title="Hapus Kelompok"><Trash /></Button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <Button type="button" variant="secondary" onClick={handleAddGroup} className="mt-2 w-fit">Tambah Kelompok</Button>
                            </div>
                            <div className=' flex'>
                                <Button type='submit' disabled={isSubmitting}>{isSubmitting ? 'Menyimpan...' : 'Simpan'}</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default PracticumSchedulingCreatePage
