import { BookingApprovalView } from '@/application/booking/BookingApprovalView';
import { useBooking } from '@/application/booking/hooks/useBooking';
import React, { useEffect, useState, useMemo, useRef } from 'react'
// import { Button } from '@/presentation/components/ui/button';
import { Skeleton } from '@/presentation/components/ui/skeleton';
import { BookingStepperView } from '@/application/booking/BookingStepperView';

interface BookingApprovalProps {
    bookingId: number
}

const BookingApproval: React.FC<BookingApprovalProps> = ({ bookingId }) => {
    const { getBookingSteps } = useBooking({});
    // Booking Stepper State
    const [bookingSteps, setBookingSteps] = useState<BookingStepperView[]>([])
    const [bookingStepsLoading, setBookingStepsLoading] = useState<boolean>(false)
    const [bookingStepsError, setBookingStepsError] = useState<string | null>(null);
    useEffect(() => {
        const loadApprovals = async () => {
            try {
                setBookingStepsLoading(true);
                const res = await getBookingSteps(bookingId);
                setBookingSteps(res.data || []);
            } catch (e: any) {
                setBookingStepsError(e?.message || 'Gagal memuat progress persetujuan');
            } finally {
                setBookingStepsLoading(false);
            }
        };
        loadApprovals();
    }, [])

    // approvalsMap, lastActionIndex now declared below for single use

    // Carousel / draggable logic
    const scrollRef = useRef<HTMLDivElement | null>(null);

    return (
        <div className="flex flex-col gap-3 w-full">
            {bookingStepsLoading && (
                <div className="flex gap-4 w-full animate-pulse justify-center mb-5">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center w-52">
                            <Skeleton className="w-10 h-10 mb-2" />
                            <Skeleton className="h-4 w-20 mb-1" />
                            <Skeleton className="h-3 w-16 mb-1" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    ))}
                </div>
            )}
            {bookingStepsError && <div className="text-sm text-red-500">{bookingStepsError}</div>}
            {!bookingStepsLoading && !bookingStepsError && bookingSteps.length === 0 && (
                <div className="text-sm text-muted-foreground">Belum ada data persetujuan.</div>
            )}
            {!bookingStepsLoading && !bookingStepsError && (
                <div className="relative pb-4 w-full flex justify-center">
                    {bookingSteps.map((step, i) => (
                        <div className={`flex items-center ${(i + 1) == bookingSteps.length ? 'w-fit' : 'w-full'}`}>
                            <div className='flex flex-col items-center w-fit gap-1'>
                                <div className="w-10 h-10 flex items-center justify-center rounded-full border-2 text-xs font-semibold shadow-sm bg-white border-gray-300 text-gray-400">
                                    {i + 1}
                                </div>
                                <div className="flex flex-col items-center w-48 text-center gap-2">
                                    <div className="text-xs font-medium leading-tight text-muted-foreground">{step.role}</div>
                                    <span className="self-center text-[10px] tracking-wide px-2 py-0.5 rounded-full font-semibold bg-gray-100 text-gray-500">PENDING</span>
                                    <div className="text-xs text-muted-foreground">
                                        {'Diverifikasi oleh: '}
                                        <span className="font-medium">{step.approver}</span>
                                        {' pada '}
                                        <br /><span className="italic text-red-500">Alasan: {step.information}</span>
                                    </div>
                                </div>
                            </div>
                            {(i + 1) < bookingSteps.length && (
                                <div className="bg-foreground min-w-32 w-full h-px"></div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default BookingApproval
