import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useEffect, useRef, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { usePracticumScheduling } from '@/application/practicum-scheduling/hooks/usePracticumScheduling';
import { PracticumSchedulingView } from '@/application/practicum-scheduling/PracticumSchedulingView';
import Header from '@/presentation/components/Header';
import { Skeleton } from '@/presentation/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/presentation/components/ui/tabs';
import { Button } from '@/presentation/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { DataTable } from '@/presentation/components/custom/Datatable';
import { PracticumScheduleGroupColumn } from './column/PracticumScheduleGroupColumn';
import { PracticumScheduleEquipmentColumn } from './column/PracticumScheduleEquipmentColumn';
import { PracticumScheduleMaterialColumn } from './column/PracticumScheduleMaterialColumn';

const PracticumSchedulingDetailPage = () => {
    const sectionRef = useRef<HTMLDivElement | null>(null);
    useGSAP(() => {
        if (!sectionRef.current) return;
        const tl = gsap.timeline();
        tl.fromTo(sectionRef.current, { opacity: 0, y: 100 }, { opacity: 1, y: 0, duration: 0.8 });
    }, []);

    const { id } = useParams<{ id: string }>();
    const practicumSchedulingId = Number(id);
    const { getPracticumSchedulingDetail } = usePracticumScheduling({})
    const [loading, setLoading] = useState(false);
    const [practicumScheduling, setPracticumScheduling] = useState<PracticumSchedulingView>();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            if (!practicumSchedulingId) return;
            try {
                setLoading(true);
                const res = await getPracticumSchedulingDetail(practicumSchedulingId);
                setPracticumScheduling(res.data);
            } catch (e: any) {
                setError(e?.message || 'Gagal memuat detail');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const defaultTab = 'general';

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

    if (error) return <div className="text-red-500">{error}</div>;
    if (!practicumScheduling) return <div>Data tidak ditemukan</div>;
    console.log(practicumScheduling);
    
    const equipments = practicumScheduling.practicumSchedulingEquipments || [];
    const materials = practicumScheduling.practicumSchedulingMaterials || [];
    const hasEquipment = Array.isArray(equipments) && equipments.length > 0;
    const hasMaterial = Array.isArray(materials) && materials.length > 0;

    return (
        <div>
            <Header title="Detail Peminjaman" />
            <div className="flex flex-col gap-4 p-4 pt-0" ref={sectionRef}>
                <Tabs defaultValue={defaultTab} className="w-full">
                    <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                        <TabsList className="flex flex-wrap">
                            <TabsTrigger value="general">Informasi Umum</TabsTrigger>
                            {hasEquipment && <TabsTrigger value="equipment">Daftar Alat</TabsTrigger>}
                            {hasMaterial && <TabsTrigger value="material">Daftar Bahan</TabsTrigger>}
                        </TabsList>
                        <NavLink to={'/panel/penjadwalan-praktikum'} className={'self-end ml-auto'}>
                            <Button className="gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Kembali
                            </Button>
                        </NavLink>
                    </div>

                    {/* <BookingApproval bookingId={bookingId} /> */}

                    <TabsContent value="general">
                        <div className='grid gap-5'>
                            {/* Informasi Umum */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informasi Umum</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-8">
                                        {practicumScheduling.user && (
                                            <div className="flex flex-col gap-5">
                                                <div className="grid gap-3 sm:grid-cols-2 text-sm">
                                                    <div className='flex flex-col gap-2'><span className="font-medium">Nama</span><div>{practicumScheduling.user.name}</div></div>
                                                    <div className='flex flex-col gap-2'><span className="font-medium">Prodi</span><div>{practicumScheduling.user.studyProgram?.name}</div></div>
                                                    <div className='flex flex-col gap-2'><span className="font-medium">Email</span><div>{practicumScheduling.user.email}</div></div>
                                                    <div className='flex flex-col gap-2'><span className="font-medium">No Hp</span><div>{practicumScheduling.phoneNumber}</div></div>
                                                    <div className='flex flex-col gap-2'><span className="font-medium">Ruangan</span><div>{practicumScheduling.laboratoryRoom?.name}</div></div>
                                                    <div className='flex flex-col gap-2'><span className="font-medium">Mata Kuliah Praktikum</span><div>{practicumScheduling.practicum?.name}</div></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Kelompok Praktikum</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <DataTable columns={PracticumScheduleGroupColumn()} data={practicumScheduling.practicumGroups || []} loading={false} />
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                    {hasEquipment && (
                        <TabsContent value="equipment">
                            <Card>
                                <CardHeader><CardTitle>Daftar Alat</CardTitle></CardHeader>
                                <CardContent>
                                    <DataTable columns={PracticumScheduleEquipmentColumn()} data={equipments} loading={false} />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    )}

                    {hasMaterial && (
                        <TabsContent value="material">
                            <Card>
                                <CardHeader><CardTitle>Daftar Bahan</CardTitle></CardHeader>
                                <CardContent>
                                    <DataTable columns={PracticumScheduleMaterialColumn()} data={materials} loading={false} />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    )}
                </Tabs>
            </div>
        </div>
    )
}

export default PracticumSchedulingDetailPage
