import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react'
import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { usePracticumScheduling } from '@/application/practicum-scheduling/hooks/usePracticumScheduling';
import { PracticumSchedulingView } from '@/application/practicum-scheduling/PracticumSchedulingView';
import Header from '@/presentation/components/Header';
import { Button } from '@/presentation/components/ui/button';
import { ArrowLeft, Info } from 'lucide-react';
import PracticumScheduleDetailDialog from './components/PracticumScheduleDetailDialog';
import PracticumScheduleEquipmentNMaterialForm from './components/PracticumScheduleEquipmentNMaterialForm';

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
    const { getPracticumSchedulingDetail } = usePracticumScheduling({})
    const [loading, setLoading] = useState(false);
    const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false)
    const [practicumScheduling, setPracticumScheduling] = useState<PracticumSchedulingView>();
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            if (!practicumSchedulingId) return;
            try {
                setLoading(true);
                const res = await getPracticumSchedulingDetail(practicumSchedulingId);
                setPracticumScheduling(res.data);
            } catch (e) {
                navigate('/404')
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <>
            <Header title="Menu Penjadwalan Praktikum" />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0" ref={sectionRef}>
                <div className='flex flex-col sm:flex-row justify-between gap-2'>
                    <Button onClick={() => setIsOpenDetail((prev) => !prev)} disabled={loading} className='order-2 sm:order-1'>
                        <Info />
                        {loading ? 'Loading...' : 'Informasi Penjadwalan'}
                    </Button>
                    <PracticumScheduleDetailDialog open={isOpenDetail} onOpenChange={setIsOpenDetail} practicumScheduling={practicumScheduling} />
                    <NavLink to={'/panel/penjadwalan-praktikum'} className='order-1 sm:order-2 ml-auto sm:ml-0'>
                        <Button>
                            Kembali
                            <ArrowLeft />
                        </Button>
                    </NavLink>
                </div>
                <PracticumScheduleEquipmentNMaterialForm/>
            </div >
        </>
    )
}

export default PracticumSchedulingManagePage
