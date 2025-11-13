import { useBooking } from '@/application/booking/hooks/useBooking';
import React, { useEffect, useState } from 'react'
import { Skeleton } from '@/presentation/components/ui/skeleton';
import { BookingStepperView } from '@/application/booking/BookingStepperView';

interface BookingStepperProps {
    bookingId: number
}

const BookingStepper: React.FC<BookingStepperProps> = ({ bookingId }) => {
    const { getBookingSteps } = useBooking({});
    const [bookingSteps, setBookingSteps] = useState<BookingStepperView[]>([])
    const [bookingStepsLoading, setBookingStepsLoading] = useState<boolean>(false)
    const [bookingStepsError, setBookingStepsError] = useState<string | null>(null);
    useEffect(() => {
        const loadSteps = async () => {
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
        loadSteps();
    }, [])

    return (
        <div className="relative flex flex-col gap-3 w-full mt-5">
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
                <div className="pb-4 w-full flex overflow-x-auto scrollbar-hidden">
                    {bookingSteps.map((step, i) => (
                        <div className={`flex items-center ${(i + 1) == bookingSteps.length ? 'w-fit' : 'w-full'}`} key={i}>
                            <div className='flex flex-col items-center w-fit gap-1'>
                                <div className={`w-10 h-10 flex items-center justify-center rounded-full text-xs font-semibold shadow-sm
                                    ${step.status === 'approved' ? 'bg-green-600 text-white' : step.status === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-300 text-gray-600'}`}
                                >
                                    {i + 1}
                                </div>
                                <div className="flex flex-col items-center w-48 text-center gap-2">
                                    <div className="text-xs font-medium leading-tight text-muted-foreground">{step.role}</div>
                                    {step.status === 'approved' ? (
                                        <span className="self-center text-[10px] tracking-wide px-2 py-0.5 rounded-full font-semibold bg-green-100 text-green-700">APPROVED</span>
                                    ) : step.status === 'rejected' ? (
                                        <span className="self-center text-[10px] tracking-wide px-2 py-0.5 rounded-full font-semibold bg-red-100 text-red-700">REJECTED</span>
                                    ) : (
                                        <span className="self-center text-[10px] tracking-wide px-2 py-0.5 rounded-full font-semibold bg-gray-100 text-gray-500">PENDING</span>
                                    )}
                                    <div className={`text-xs text-muted-foreground ${(step.status === 'approved' || step.status === 'rejected') && step.approver ? '' : 'invisible'}`} >
                                        {step.status === 'approved' ? 'Diverifikasi oleh: ' : 'Ditolak oleh: '}
                                        <span className="font-medium">{step.approver}</span>
                                        {step.approvedAt ? ' pada ' + step.approvedAt.formatForInformation() : ''}
                                        {step.information && (
                                            <><br /><span className={`italic ${step.status === 'rejected' ? 'text-red-500': (step.status ? 'text-green-700' : 'text-orange-500')}`}>{step.status === 'approved' ? 'Catatan' : 'Alasan'}: {step.information}</span></>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {(i + 1) < bookingSteps.length && (
                                <div className="bg-foreground min-w-32 w-full h-px rounded-full"></div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default BookingStepper
