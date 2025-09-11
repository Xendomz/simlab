import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { useBooking } from '@/application/booking/hooks/useBooking';
import { BookingView } from '@/application/booking/BookingView';
import Header from '@/presentation/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/presentation/components/ui/tabs';
import { DataTable } from '@/presentation/components/custom/Datatable';
import { BookingType } from '@/domain/booking/BookingType';
import { BookingMaterialColumn } from './column/BookingMaterialColumn';
import { BookingEquipmentColumn } from './column/BookingEquipmentColumn';
import BookingStepper from './components/BookingStepper';
import { useAuth } from '@/application/hooks/useAuth';
import { Skeleton } from '@/presentation/components/ui/skeleton';

export const BookingDetailPage: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth()
  const { id } = useParams<{ id: string }>();
  const bookingId = Number(id);
  const { getBookingDetail } = useBooking({});

  // Booking Detail State
  const [booking, setBooking] = useState<BookingView>();
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const getBookingDetailData = async () => {
    try {
      setBookingLoading(true);
      const res = await getBookingDetail(bookingId);
      setBooking(res.data);
    } catch (e: any) {
      setBookingError(e?.message || 'Gagal memuat detail');
    } finally {
      setBookingLoading(false);
    }
  }

  useEffect(() => {
    getBookingDetailData();
  }, []);

  useGSAP(() => {
    if (!sectionRef.current) return;
    const tl = gsap.timeline();
    tl.fromTo(sectionRef.current, { opacity: 0, y: 100 }, { opacity: 1, y: 0, duration: 0.8 });
  }, []);

  const defaultTab = 'general';

  if (bookingLoading) return (
    <>
      <Header title="Detail Peminjaman" />
      <div className="flex flex-col gap-4 p-4 pt-0">
        <div className="flex flex-col gap-4 animate-pulse">
          <Skeleton className="h-8 w-1/3 mb-2" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-64 w-full" />
            <div className="flex flex-col gap-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  if (bookingError) return <div className="text-red-500">{bookingError}</div>;
  if (!booking) return <div>Data tidak ditemukan</div>;

  const equipments = Array.isArray((booking as any).bookingEquipment) ? (booking as any).bookingEquipment : [];
  const materials = Array.isArray((booking as any).bookingMaterial) ? (booking as any).bookingMaterial : [];
  const hasRoom = !!booking.laboratoryRoom;
  const hasEquipment = equipments.length > 0;
  const hasMaterial = materials.length > 0;

  return (
    <>
      <Header title="Detail Peminjaman" />
      <div className="flex flex-col gap-4 p-4 pt-0" ref={sectionRef}>
        <Tabs defaultValue={defaultTab} className="w-full">
          <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
            {booking.bookingType != BookingType.Room && (
              <TabsList className="flex flex-wrap">
                <TabsTrigger value="general">Informasi Umum</TabsTrigger>
                {hasEquipment && <TabsTrigger value="equipment">Daftar Alat</TabsTrigger>}
                {hasMaterial && <TabsTrigger value="material">Daftar Bahan</TabsTrigger>}
              </TabsList>
            )}
            <NavLink to={['Kepala Lab Terpadu', 'Laboran'].includes(user?.role ?? '') ? '/panel/peminjaman/verif' : '/panel/peminjaman'} className={'self-end ml-auto'}>
              <Button className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Kembali
              </Button>
            </NavLink>
          </div>

          <BookingStepper bookingId={bookingId} />

          <TabsContent value="general">
            <div className='grid grid-cols-2 gap-4'>
              {/* Informasi Umum */}
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Umum</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="grid sm:grid-cols-2 text-sm gap-4">
                      <div className='flex flex-col'>
                        <span className="font-semibold">Jenis Peminjaman</span>
                        <div className='text-muted-foreground'>{booking.getFormattedBookingType?.() ?? booking.bookingType}</div>
                      </div>
                      <div className='flex flex-col'>
                        <span className="font-semibold">Judul Kegiatan</span>
                        <div className='text-muted-foreground'>{booking.activityName}</div>
                      </div>
                      <div className='flex flex-col'>
                        <span className="font-semibold">Keperluan</span>
                        <div className='text-muted-foreground'>{booking.purpose}</div>
                      </div>
                      <div className='flex flex-col'>
                        <span className="font-semibold">Waktu Mulai</span>
                        <div className='text-muted-foreground'>{booking.startTime.formatForInformation()}</div>
                      </div>
                      <div className='flex flex-col'>
                        <span className="font-semibold">Waktu Selesai</span>
                        <div className='text-muted-foreground'>{booking.endTime.formatForInformation()}</div>
                      </div>
                      <div className='flex flex-col'>
                        <span className="font-semibold">Supervisor</span>
                        <div className='text-muted-foreground'>{booking.supervisor || '-'}</div>
                      </div>
                      <div className='flex flex-col'>
                        <span className="font-semibold">Email Supervisor</span>
                        <div className='text-muted-foreground'>{booking.supervisorEmail || '-'}</div>
                      </div>
                      <div className='flex flex-col'>
                        <span className="font-semibold">Dibuat</span>
                        <div className='text-muted-foreground'>{booking.createdAt.formatForInformation()}</div>
                      </div>
                      <div className='flex flex-col'>
                        <span className="font-semibold">Diperbarui</span>
                        <div className='text-muted-foreground'>{booking.updatedAt.formatForInformation()}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className='flex flex-col gap-4'>

                {/* Data Pemohon */}
                <Card>
                  <CardHeader>
                    <CardTitle>Pemohon</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {booking.user && (
                        <div className="flex flex-col gap-4">
                          <div className="grid gap-3 sm:grid-cols-2 text-sm">
                            <div className='flex flex-col'>
                              <span className="font-semibold">Nama</span>
                              <div className='text-muted-foreground'>{booking.user.name}</div>
                            </div>
                            <div className='flex flex-col'>
                              <span className="font-semibold">Email</span>
                              <div className='text-muted-foreground'>{booking.user.email}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Ruangan Peminjaman */}
                <Card>
                  <CardHeader>
                    <CardTitle>Detail Ruangan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {hasRoom ? (
                        <div className="grid gap-4 sm:grid-cols-2 text-sm">
                          <div className='flex flex-col'>
                            <span className="font-semibold">Ruangan </span>
                            <div className='text-muted-foreground'>{booking.laboratoryRoom?.name}</div>
                          </div>
                          <div className='flex flex-col'>
                            <span className="font-semibold">Peserta</span>
                            <div className='text-muted-foreground'>{booking.totalParticipant} Peserta</div></div>
                          <div className="sm:col-span-2 flex flex-col">
                            <span className="font-semibold">Daftar Peserta</span>
                            <div className="whitespace-pre-wrap break-words border rounded p-2 bg-muted/30">{booking.participantList || '-'}</div>
                          </div>
                        </div>
                      ) : (
                        <span>Ruangan Belum Ditentukan</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

            </div>
          </TabsContent>
          {booking.bookingType != BookingType.Room && (
            <>
              {hasEquipment && (
                <TabsContent value="equipment">
                  <Card>
                    <CardHeader><CardTitle>Daftar Alat</CardTitle></CardHeader>
                    <CardContent>
                      <DataTable columns={BookingEquipmentColumn()} data={equipments} loading={false} />
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {hasMaterial && (
                <TabsContent value="material">
                  <Card>
                    <CardHeader><CardTitle>Daftar Bahan</CardTitle></CardHeader>
                    <CardContent>
                      <DataTable columns={BookingMaterialColumn()} data={materials} loading={false} />
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

            </>
          )}
        </Tabs>
      </div>
    </>
  );
};
