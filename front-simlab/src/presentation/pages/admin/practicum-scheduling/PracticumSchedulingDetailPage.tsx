import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { PracticumSchedulingView } from '@/application/practicum-scheduling/PracticumSchedulingView';
import Header from '@/presentation/components/Header';
import { Skeleton } from '@/presentation/components/ui/skeleton';
import { Button } from '@/presentation/components/ui/button';
import { ArrowLeft, Eye } from 'lucide-react';
import { DataTable } from '@/presentation/components/custom/Datatable';
import { PracticumScheduleSessionColumn } from './column/PracticumScheduleSessionColumn';
import PracticumStepper from './PracticumStepper';
import Item from '@/presentation/components/Item';
import { PracticumSchedulingService } from '@/application/practicum-scheduling/PracticumSchedulingService';
import PracticumSchedulingEquipmentDialog from './components/PracticumSchedulingEquipmentDialog';
import PracticumSchedulingMaterialDialog from './components/PracticumSchedulingMaterialDialog';
import { useAuth } from '@/application/hooks/useAuth';
import { userRole } from '@/domain/User/UserRole';

const PracticumSchedulingDetailPage = () => {
    const sectionRef = useRef<HTMLDivElement | null>(null);
    useGSAP(() => {
        if (!sectionRef.current) return;
        const tl = gsap.timeline();
        tl.fromTo(sectionRef.current, { opacity: 0, y: 100 }, { opacity: 1, y: 0, duration: 0.8 });
    }, []);

    const {user} = useAuth()
    const { id } = useParams<{ id: string }>();
    const practicumSchedulingId = Number(id);
    const practicumSchedulingService = new PracticumSchedulingService()
    const navigate = useNavigate();

    let backTo = '/panel/penjadwalan-praktikum';
    if (user?.role && [userRole.Laboran, userRole.KepalaLabTerpadu].includes(user.role)) {
        backTo = `/panel/penjadwalan-praktikum/verif`;
    } 

    const [loading, setLoading] = useState(false);
    const [practicumScheduling, setPracticumScheduling] = useState<PracticumSchedulingView>();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            if (!practicumSchedulingId) return;
            try {
                setLoading(true);
                const res = await practicumSchedulingService.getPracticumSchedulingDetail(practicumSchedulingId);
                setPracticumScheduling(res.data);
            } catch (e: any) {
                setError(e?.message || 'Gagal memuat detail');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const [openPracticumSchedulingEquipmentDialog, setOpenPracticumSchedulingEquipmentDialog] = useState<boolean>(false)
    const [openPracticumSchedulingMaterialDialog, setOpenPracticumSchedulingMaterialDialog] = useState<boolean>(false)

    if (loading) return (
        <>
            <Header title="Detail Penjadwalan Praktikum" />
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
        </>
    );

    if (!practicumScheduling) return <div>Data tidak ditemukan</div>;

    const equipments = practicumScheduling.practicumSchedulingEquipments || [];
    const materials = practicumScheduling.practicumSchedulingMaterials || [];
    const hasEquipment = Array.isArray(equipments) && equipments.length > 0;
    const hasMaterial = Array.isArray(materials) && materials.length > 0;

    return (
        <div>
            <Header title="Detail Peminjaman" />
            <div className="flex flex-col gap-4 p-4 pt-0" ref={sectionRef}>
                <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                    <div className={'self-end ml-auto'}>
                        <Button className="gap-2" onClick={() => navigate(backTo)}>
                            <ArrowLeft className="w-4 h-4" />
                            Kembali
                        </Button>
                    </div>
                </div>

                <PracticumStepper practicumId={practicumSchedulingId} />
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
                                            <Item title='Nama' value={practicumScheduling.user.name} />
                                            <Item title='Prodi' value={practicumScheduling.user.studyProgram?.name} />
                                            <Item title='Email' value={practicumScheduling.user.email} />
                                            <Item title='No Hp' value={practicumScheduling.phoneNumber} />
                                            <Item title='Mata Kuliah/Pratikum' value={practicumScheduling.practicum?.name} />
                                            <Item title='Laboran Penanggung Jawab' value={practicumScheduling.laboran?.name} />
                                            {hasEquipment && (
                                                <div className={`flex flex-col`}>
                                                    <span className='font-semibold'>Daftar Peminjaman Alat</span>

                                                    <Button onClick={() => setOpenPracticumSchedulingEquipmentDialog(true)}>Lihat Daftar Alat <Eye /></Button>
                                                    <PracticumSchedulingEquipmentDialog
                                                        open={openPracticumSchedulingEquipmentDialog}
                                                        onOpenChange={setOpenPracticumSchedulingEquipmentDialog}
                                                        data={equipments} />
                                                </div>
                                            )}
                                            {hasMaterial && (
                                                <div className={`flex flex-col`}>
                                                    <span className='font-semibold'>Daftar Pengajuan Bahan</span>
                                                    <Button onClick={() => setOpenPracticumSchedulingMaterialDialog(true)}>Lihat Daftar Bahan <Eye /></Button>
                                                    <PracticumSchedulingMaterialDialog
                                                        open={openPracticumSchedulingMaterialDialog}
                                                        onOpenChange={setOpenPracticumSchedulingMaterialDialog}
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
                                        <DataTable columns={PracticumScheduleSessionColumn()} data={cls.practicumSessions || []} loading={false} />
                                    </Fragment>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default PracticumSchedulingDetailPage
