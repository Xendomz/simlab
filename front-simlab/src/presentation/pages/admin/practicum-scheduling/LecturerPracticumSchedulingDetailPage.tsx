import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { PracticumSchedulingView } from '@/application/practicum-scheduling/PracticumSchedulingView';
import { Skeleton } from '@/presentation/components/ui/skeleton';
import { Button } from '@/presentation/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { DataTable } from '@/presentation/components/custom/Datatable';
import Item from '@/presentation/components/Item';
import PracticumSchedulingEquipmentDialog from './components/PracticumSchedulingEquipmentDialog';
import PracticumSchedulingMaterialDialog from './components/PracticumSchedulingMaterialDialog';
import { useAuth } from '@/application/hooks/useAuth';
import { userRole } from '@/domain/User/UserRole';
import { useDepedencies } from '@/presentation/contexts/useDepedencies';
import PracticumSchedulingBadgeStatus from './components/PracticumSchedulingBadgeStatus';
import { PracticumSchedulingLecturerNotesDTO } from '@/application/practicum-scheduling/dto/PracticumSchedulingDTO';
import { toast } from 'sonner';
import { PracticumSchedulingLecturerSessionColumn } from './column/PracticumSchedulingLecturerSessionColumn';
import ApproveDialog from '@/presentation/components/custom/ApproveDialog';

const LecturerPracticumSchedulingDetailPage = () => {
    const sectionRef = useRef<HTMLDivElement | null>(null);
    useGSAP(() => {
        if (!sectionRef.current) return;
        const tl = gsap.timeline();
        tl.fromTo(sectionRef.current, { opacity: 0, y: 100 }, { opacity: 1, y: 0, duration: 0.8 });
    }, []);

    const { user } = useAuth()
    const { practicumSchedulingService } = useDepedencies()
    const { id } = useParams<{ id: string }>();
    const practicumSchedulingId = Number(id);
    const navigate = useNavigate();

    const backTo =
        user?.role && [userRole.Laboran, userRole.KepalaLabTerpadu].includes(user.role)
            ? '/panel/penjadwalan-praktikum/verif'
            : '/panel/penjadwalan-praktikum';

    const [isLoading, setIsLoading] = useState(false);
    const [practicumScheduling, setPracticumScheduling] = useState<PracticumSchedulingView>();

    const [isOpenConfirmation, setIsOpenConfirmation] = useState<boolean>(false)
    const [selectedSession, setSelectedSession] = useState<PracticumSchedulingLecturerNotesDTO>({ session_id: 0, information: null })
    const handleOpenLecturerNotesConfirm = (id: number) => {
        setSelectedSession({ session_id: id, information: null })
        setIsOpenConfirmation(true)
    }

    const load = useCallback(async () => {
        if (!practicumSchedulingId) return;
        try {
            setIsLoading(true);
            const res = await practicumSchedulingService.getPracticumSchedulingDetail(practicumSchedulingId);
            setPracticumScheduling(res.data);
        } catch {
            navigate('/404')
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, []);

    const equipments = practicumScheduling?.practicumSchedulingEquipments || [];
    const materials = practicumScheduling?.practicumSchedulingMaterials || [];
    const hasEquipment = Array.isArray(equipments) && equipments.length > 0;
    const hasMaterial = Array.isArray(materials) && materials.length > 0;

    const handleLecturerNote = async (information: string) => {
        if (!practicumSchedulingId) return;

        const payload: PracticumSchedulingLecturerNotesDTO = {
            ...selectedSession,
            information: information
        }
        const res = await practicumSchedulingService.setLecturerNote(practicumSchedulingId, payload)
        setIsOpenConfirmation(false);
        toast.success(res.message)
        await load()
        setSelectedSession({
            session_id: 0,
            information: null
        })
    }
    return (
        <>
            {isLoading || !practicumScheduling
                ? (
                    <div className="flex flex-col gap-4 p-4 pt-0">
                        <div className="flex flex-col gap-4 animate-pulse">
                            <Skeleton className="h-8 w-1/3 mb-2" />
                            <div className="grid grid-cols-2 gap-5">
                                <Skeleton className="h-64 w-full" />
                                <div className="flex flex-col gap-5">
                                    <Skeleton className="h-32 w-full" />
                                    <Skeleton className="h-32 w-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 p-4 pt-0" ref={sectionRef}>
                        <div className="flex items-center justify-between flex-col-reverse sm:flex-row mb-2 gap-2">
                            <Button className="gap-2 w-full sm:w-fit" onClick={() => navigate(backTo)}>
                                <ArrowLeft className="w-4 h-4" />
                                Kembali
                            </Button>
                        </div>
                        <div className='grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-5'>
                            {/* Informasi Umum */}
                            <Card className='lg:col-span-2 h-fit'>
                                <CardHeader>
                                    <CardTitle>Informasi Umum</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-8">
                                        {practicumScheduling.user && (
                                            <div className="flex flex-col gap-5">
                                                <div className="flex flex-col gap-5">
                                                    <Item title='Mata Kuliah/Pratikum' value={practicumScheduling.practicum?.name} />
                                                    <Item title='Laboran Penanggung Jawab' value={practicumScheduling.laboran?.name} />
                                                    <div className="flex flex-col">
                                                        <span className='font-semibold'>Status Pengajuan</span>
                                                        <PracticumSchedulingBadgeStatus status={practicumScheduling.status} />
                                                    </div>
                                                    {hasEquipment && (
                                                        <div className={`flex flex-col`}>
                                                            <span className='font-semibold'>Daftar Peminjaman Alat</span>
                                                            <PracticumSchedulingEquipmentDialog
                                                                data={equipments} />
                                                        </div>
                                                    )}
                                                    {hasMaterial && (
                                                        <div className={`flex flex-col`}>
                                                            <span className='font-semibold'>Daftar Pengajuan Bahan</span>
                                                            <PracticumSchedulingMaterialDialog
                                                                data={materials} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className='lg:col-span-4 xl:col-span-6 2xl:col-span-8 h-fit'>
                                <CardHeader>
                                    <CardTitle>Kelas Praktikum</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col gap-5">
                                        {practicumScheduling.practicumClasses?.map((cls, idx) => (
                                            <Fragment key={cls.id ?? idx}>
                                                {idx > 0 && (<hr />)}
                                                <div className='grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5'>
                                                    <Item title={'Nama Kelas'} value={cls.name} />
                                                    <Item title={'Dosen Pengampu'} value={cls.lecturer?.name} />
                                                    <Item title={'Asisten Dosen'} value={cls.practicumAssistant} />
                                                    <Item title={'Ruangan Praktikum'} value={cls.laboratoryRoom?.name} />
                                                    <Item title={'Total Partisipan'} value={cls.totalParticipant} />
                                                    <Item title={'Total Kelompok'} value={cls.totalGroup} />
                                                </div>
                                                <DataTable columns={PracticumSchedulingLecturerSessionColumn(handleOpenLecturerNotesConfirm)} data={cls.practicumSessions || []} loading={false} />
                                            </Fragment>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            <ApproveDialog onOpenChange={setIsOpenConfirmation} open={isOpenConfirmation} handleSave={handleLecturerNote} title='Catatan Dosen' message='Tuliskan catatan atau keterangan terkait sesi ini' buttonLabel='Simpan' />
        </>
    )
}

export default LecturerPracticumSchedulingDetailPage