import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBooking } from '@/application/booking/hooks/useBooking';
import { BookingView } from '@/application/booking/BookingView';
import Header from '@/presentation/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/application/hooks/useAuth';
import { Skeleton } from '@/presentation/components/ui/skeleton';
import Item from '@/presentation/components/Item';
import BookingStepperDialog from './components/BookingStepperDialog';
import BookingEquipmentDialog from './components/BookingEquipmentDialog';
import BookingMaterialDialog from './components/BookingMaterialDialog';
import { userRole } from '@/domain/User/UserRole';
import BookingBadgeStatus from './components/BookingBadgeStatus';
import { Badge } from '@/presentation/components/ui/badge';
import { BookingType } from '@/domain/booking/BookingType';

export const BookingDetailPage: React.FC = () => {
  useGSAP(() => {
    if (!sectionRef.current) return;
    const tl = gsap.timeline();
    tl.fromTo(sectionRef.current, { opacity: 0, y: 100 }, { opacity: 1, y: 0, duration: 0.8 });
  }, []);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth()
  const { id } = useParams<{ id: string }>();
  const bookingId = Number(id);
  const { getBookingDetail } = useBooking({});

  // Booking Detail State
  const [booking, setBooking] = useState<BookingView>();
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const backTo =
    user?.role && [userRole.Laboran, userRole.KepalaLabTerpadu].includes(user.role)
      ? '/panel/peminjaman/verif'
      : '/panel/peminjaman';

  const getBookingDetailData = async () => {
    try {
      setBookingLoading(true);
      const res = await getBookingDetail(bookingId);
      setBooking(res.data);
    } catch (error: any) {
      if (error.code == 404) {
        navigate('/404')
      } else if (error.code == 403) {
        navigate('/404')
      }
    } finally {
      setBookingLoading(false);
    }
  }

  useEffect(() => {
    getBookingDetailData();
  }, []);

  if (bookingLoading || !booking) return (
    <>
      <Header title="Detail Peminjaman" />
      <div className="flex flex-col gap-4 p-4 pt-0">
        <div className="flex flex-col gap-4 animate-pulse">
          <Skeleton className="h-8 w-1/3 mb-2" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

  const equipments = Array.isArray((booking as any).bookingEquipments) ? (booking as any).bookingEquipments : [];
  const materials = Array.isArray((booking as any).bookingMaterials) ? (booking as any).bookingMaterials : [];
  const hasRoom = !!booking.laboratoryRoomName;
  const hasEquipment = equipments.length > 0;
  const hasMaterial = materials.length > 0;

  return (
    <>
      <Header title="Detail Peminjaman" />
      <div className="flex flex-col gap-4 p-4 pt-0" ref={sectionRef}>
        <div className="flex items-center justify-between flex-col-reverse sm:flex-row mb-2 gap-2">
          <BookingStepperDialog bookingId={bookingId} />
          <Button className="gap-2 w-full sm:w-fit" onClick={() => navigate(backTo)}>
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
        </div>
        <div className='flex flex-col gap-4'>
          {/* Informasi Umum */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Umum</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 text-sm gap-4">
                  {booking.requestor && (
                    <>
                      <Item title='Nama Pemohon' value={booking.requestor.email} />
                      <Item title='Email Pemohon' value={booking.requestor.name} />
                    </>
                  )}
                  <Item title='Dosen Pembimbing' value={booking.supervisor} />
                  <Item title='Email Dosen Pembimbing' value={booking.supervisorEmail} />
                  {booking.laboran && (
                    <>
                      <Item title='Laboran Penanggung Jawab' value={booking.laboran.name} />
                      <Item title='Email Laboran' value={booking.laboran.email} />
                    </>
                  )}
                  <Item title='Jenis Peminjaman' value={booking.getFormattedBookingType?.() ?? booking.bookingType} />
                  <Item title='Judul Kegiatan' value={booking.activityName} />
                  <Item title='Keperluan' value={booking.purpose} />
                  <div className="flex flex-col">
                    <span className='font-semibold'>Waktu Peminjaman</span>
                    <Badge variant={'secondary'} className='whitespace-normal'>{`${booking.startTime.formatForInformation()} - ${booking.endTime.formatForInformation()}`}</Badge>
                  </div>
                  <div className="flex flex-col">
                    <span className='font-semibold'>Status Pengajuan</span>
                    <BookingBadgeStatus status={booking.status} />
                  </div>
                  <Item title='Tanggal Diajukan' value={booking.createdAt.formatForInformation()} />
                  {hasEquipment && (
                    <BookingEquipmentDialog data={equipments} is_allowed_offsite={booking.bookingType === BookingType.Equipment ? booking.isAllowedOffsite : undefined} />
                  )}
                  {hasMaterial && (
                    <BookingMaterialDialog data={materials} />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className='flex flex-col gap-4'>
            {/* Ruangan Peminjaman */}
            <Card>
              <CardHeader>
                <CardTitle>Detail Ruangan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {hasRoom ? (
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 text-sm">
                      <div className='flex flex-col'>
                        <span className="font-semibold">Ruangan </span>
                        <div className='text-muted-foreground'>{booking.laboratoryRoomName}</div>
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
                    <span className='text-sm'>Ruangan Belum Ditentukan</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </>
  );
};
