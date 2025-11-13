import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react'
import Header from '@/presentation/components/Header'
import { Button } from '@/presentation/components/ui/button'
import { ArrowLeft, Info } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { BookingView } from '@/application/booking/BookingView';
import BookingDetailDialog from './components/BookingDetailDialog';
import { BookingType } from '@/domain/booking/BookingType';
import BookingRoomNEquipmentForm from './form/BookingRoomNEquipmentForm';
import { BookingStatus } from '@/domain/booking/BookingStatus';
import BookingEquipmentForm from './form/BookingEquipmentForm';
import { useDepedencies } from '@/presentation/contexts/useDepedencies';
import { Skeleton } from '@/presentation/components/ui/skeleton';

const BookingManagePage = () => {
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

  const { id } = useParams();
  const { bookingService } = useDepedencies()

  const [booking, setBooking] = useState<BookingView>()
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false)
  const [isRetreiveBooking, setIsRetreiveBooking] = useState(false)
  const navigate = useNavigate();

  const retreiveBookingDetail = useCallback(async () => {
    setIsRetreiveBooking(true)
    try {
      const response = await bookingService.getBookingDetail(Number(id))
      setBooking(response.data)
      setIsRetreiveBooking(false)
    } catch (error: any) {
      if (error.code == 404) {
        navigate('/404')
      } else if (error.code == 403) {
        navigate('/404')
      }
    }
  }, [bookingService, id])

  useEffect(() => { retreiveBookingDetail() }, [])

  useEffect(() => {
    if (!booking) return
    const disallow = () => navigate('/404')

    if (![BookingStatus.Draft].includes(booking.status)) {
      disallow();
      return;
    }

    switch (booking.bookingType) {
      case BookingType.RoomNEquipment:
        if (booking.laboratoryRoom && booking.bookingEquipment && booking.bookingEquipment.length > 0) disallow();
        break;
      case BookingType.Equipment:
        if (booking.bookingEquipment && booking.bookingEquipment.length > 0) disallow();
        break;
      default:
        disallow();
    }
  }, [booking, navigate])

  return (
    <>
      <Header title="Menu Peminjaman" />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0" ref={sectionRef}>
        <div className='flex flex-col sm:flex-row justify-between gap-2'>
          <Button onClick={() => setIsOpenDetail((prev) => !prev)} disabled={isRetreiveBooking} className='order-2 sm:order-1'>
            <Info />
            {isRetreiveBooking ? 'Loading...' : 'Informasi Peminjaman'}
          </Button>
          <BookingDetailDialog open={isOpenDetail} onOpenChange={setIsOpenDetail} booking={booking} />
          <NavLink to={'/panel/peminjaman'} className='order-1 sm:order-2 ml-auto sm:ml-0'>
            <Button>
              Kembali
              <ArrowLeft />
            </Button>
          </NavLink>
        </div>
        {/* Conditional Content */}
        {isRetreiveBooking ? (
          <div className="flex flex-col gap-4 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-64 w-full" />
              <div className="flex flex-col gap-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </div>
        ) : booking ? (
          <>
            {booking.bookingType === BookingType.Equipment && (
              <BookingEquipmentForm />
            )}

            {booking.bookingType === BookingType.RoomNEquipment && (
              <BookingRoomNEquipmentForm />
            )}
          </>
        ) : null}
      </div >
    </>
  )
}

export default BookingManagePage
