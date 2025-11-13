import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react'
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PracticumSchedulingView } from '@/application/practicum-scheduling/PracticumSchedulingView';
import PracticumScheduleEquipmentNMaterialForm from './components/PracticumScheduleEquipmentNMaterialForm';
import { PracticumSchedulingService } from '@/application/practicum-scheduling/PracticumSchedulingService';
import { usePracticumScheduling } from './context/PracticumSchedulingContext';
import { PracticumSchedulingStatus } from '@/domain/practicum-scheduling/PracticumSchedulingStatus';

const PracticumSchedulingManagePage = () => {
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

    const { id } = useParams<{ id: string }>();
    const practicumSchedulingId = Number(id);
    const practicumSchedulingService = new PracticumSchedulingService()
    const { isHasDraftPracticum } = usePracticumScheduling()
    const [practicumScheduling, setPracticumScheduling] = useState<PracticumSchedulingView>();
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            if (!practicumSchedulingId) return;
            try {
                const res = await practicumSchedulingService.getPracticumSchedulingDetail(practicumSchedulingId);
                setPracticumScheduling(res.data);
            } catch {
                navigate('/404');
            }
        };
        load();
    }, []);

    useEffect(() => {
        if (practicumScheduling) {
            if (isHasDraftPracticum && practicumScheduling.status !== PracticumSchedulingStatus.Draft) {
                navigate('/404')
            }
        }
    }, [isHasDraftPracticum, practicumScheduling])

    return (
        <>
            <PracticumScheduleEquipmentNMaterialForm practicumScheduling={practicumScheduling} />
        </>
    )
}

export default PracticumSchedulingManagePage
