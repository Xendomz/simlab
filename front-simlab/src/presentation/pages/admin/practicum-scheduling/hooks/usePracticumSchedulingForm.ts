import { PracticumModuleSelectView } from "@/application/practicum-module/PracticumModuleSelectView";
import { PracticumSchedulingInputDTO } from "@/application/practicum-scheduling/dto/PracticumSchedulingDTO";
import { PracticumSelectView } from "@/application/practicum/PracticumSelectView";
import { useState } from "react";

export function usePracticumSchedulingForm() {
    // Handler to duplicate a specific class by index
    const duplicateClassByIndex = (classIdx: number) => {
        setFormData(prev => {
            const classToDuplicate = prev.classes[classIdx];
            if (!classToDuplicate) return prev;
            const duplicatedClass = {
                ...classToDuplicate,
                sessions: classToDuplicate.sessions.map(sess => ({ ...sess }))
            };
            return {
                ...prev,
                classes: [...prev.classes, duplicatedClass]
            };
        });
    };
    // Custom function to update practicum_module_id for a session
    const updateSessionModule = (classIdx: number, sessionIdx: number, moduleId: number) => {
        setFormData(prev => ({
            ...prev,
            classes: prev.classes.map((cls, cidx) => {
                if (cidx !== classIdx) return cls;
                return {
                    ...cls,
                    sessions: cls.sessions.map((sess, sidx) => {
                        if (sidx !== sessionIdx) return sess;
                        return {
                            ...sess,
                            practicum_module_id: moduleId
                        };
                    })
                };
            })
        }));
    };
    const [formData, setFormData] = useState<PracticumSchedulingInputDTO>({
        practicum_id: null,
        phone_number: "",
        classes: [
            {
                lecturer_id: null,
                laboratory_room_id: null,
                name: "",
                practicum_assistant: "",
                total_participant: null,
                total_group: null,
                sessions: [
                    {
                        practicum_module_id: null,
                        start_time: null,
                        end_time: null
                    }
                ]
            }
        ]
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleClassChange = (e: React.ChangeEvent<HTMLInputElement>, classIdx: number) => {
        const {type, name, value } = e.target;
        
        let newValue = value;
        if (type === "number") {
            if (newValue.length > 1 && newValue.startsWith('0')) {
                newValue = newValue.replace(/^0+/, '');
                if (newValue === '') newValue = '0';
            }
        }
        setFormData(prev => ({
            ...prev,
            classes: prev.classes.map((cls, idx) =>
                idx === classIdx ? { ...cls, [name]: newValue } : cls
            )
        }));
    };

    const getPracticumModule = (practicums: PracticumSelectView[]): PracticumModuleSelectView[] => {
        // Reset all laboratory_room_id fields in classes
        resetAllLaboratoryRoomId();
        const practicumModules = practicums.find((practicum) => practicum.id === formData.practicum_id);
        return practicumModules?.practicumModules ?? [];
    };

    // Custom function to reset all laboratory_room_id in classes
    const resetAllLaboratoryRoomId = () => {
        setFormData(prev => ({
            ...prev,
            classes: prev.classes.map(cls => ({
                ...cls,
                laboratory_room_id: null
            }))
        }));
    };

    // Tambah class baru
    const handleAddClass = () => {
        const newClass = {
            lecturer_id: null,
            laboratory_room_id: null,
            name: "",
            practicum_assistant: "",
            total_participant: null,
            total_group: null,
            sessions: [
                {
                    practicum_module_id: null,
                    start_time: null,
                    end_time: null
                }
            ]
        };
        setFormData(prev => ({
            ...prev,
            classes: [...prev.classes, newClass]
        }));
    };

    // Hapus class berdasarkan index
    const handleRemoveClass = (idx: number) => {
        setFormData(prev => ({
            ...prev,
            classes: prev.classes.filter((_, i) => i !== idx)
        }));
    };

    // Tambah session ke class tertentu
    const handleAddSession = (classIdx: number) => {
        setFormData(prev => ({
            ...prev,
            classes: prev.classes.map((c, i) =>
                i === classIdx
                    ? {
                        ...c,
                        sessions: [
                            ...c.sessions,
                            {
                                practicum_module_id: null,
                                start_time: null,
                                end_time: null
                            }
                        ]
                    }
                    : c
            )
        }));
    };

    // Hapus session dari class tertentu
    const handleRemoveSession = (classIdx: number, sessionIdx: number) => {
        setFormData(prev => ({
            ...prev,
            classes: prev.classes.map((c, i) =>
                i === classIdx
                    ? {
                        ...c,
                        sessions: c.sessions.filter((_, sIdx) => sIdx !== sessionIdx)
                    }
                    : c
            )
        }));
    };

    // Custom function untuk update start_time dan end_time pada session
    const updateSessionDateTime = (classIdx: number, sessionIdx: number, date: Date = new Date(), startTime: string = '08:00', endTime: string = '17:00') => {
        setFormData(prevFormData => {
            const updatedClasses = prevFormData.classes.map((c, cidx) => {
                if (cidx !== classIdx) return c;
                return {
                    ...c,
                    sessions: c.sessions.map((s, sidx) => {
                        if (sidx !== sessionIdx) return s;
                        const start = date ? new Date(date) : new Date();
                        const end = date ? new Date(date) : new Date();
                        if (startTime) {
                            const [h, m] = startTime.split(":").map(Number);
                            start.setHours(h, m, 0, 0);
                        }
                        if (endTime) {
                            const [h, m] = endTime.split(":").map(Number);
                            end.setHours(h, m, 0, 0);
                        }
                        return { ...s, start_time: start, end_time: end };
                    })
                };
            });
            return { ...prevFormData, classes: updatedClasses };
        });
    };

    return {
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
        resetAllLaboratoryRoomId,
        updateSessionModule,
        duplicateClassByIndex
    }
}