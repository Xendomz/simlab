import { useDepedencies } from '@/presentation/contexts/useDepedencies'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/presentation/components/ui/dialog'
import React, { useEffect, useState } from 'react'
import { Button } from '@/presentation/components/ui/button'
import { CheckCircle, Info, InfoIcon, X } from 'lucide-react'
import { ScrollArea } from '@/presentation/components/ui/scroll-area'
import { Separator } from '@/presentation/components/ui/separator'
import { BookingApprovalStatus } from '@/domain/booking/BookingApprovalStatus'
import { BookingApprovalAction } from '@/domain/booking/BookingApprovalAction'
import { BookingApprovalView } from '@/application/booking/BookingApprovalView'

interface BookingStepperDialogProps {
    bookingId: number
}

const BookingStepperDialog: React.FC<BookingStepperDialogProps> = ({
    bookingId
}) => {
    const [bookingSteps, setBookingSteps] = useState<BookingApprovalView[]>([])
    const [bookingStepsLoading, setBookingStepsLoading] = useState<boolean>(false)
    const { bookingService } = useDepedencies()

    useEffect(() => {
        const loadSteps = async () => {
            setBookingStepsLoading(true)
            const res = await bookingService.getBookingApprovals(bookingId)
            setBookingSteps(res.data || [])
            setBookingStepsLoading(false)
        }

        loadSteps()
    }, [])

    const getStepperStatus = (steps: BookingApprovalStatus) => {
        switch (steps) {
            case BookingApprovalStatus.Approved:
                return (
                    <div className='absolute left-0 top-3.5 flex size-4 items-center justify-center rounded-full bg-green-400 text-white'>
                        <CheckCircle />
                    </div>
                )
            case BookingApprovalStatus.Rejected:
                return (
                    <div className='absolute left-0 top-3.5 flex size-4 items-center justify-center rounded-full bg-red-400 text-white'>
                        <X />
                    </div>
                )
            case BookingApprovalStatus.Revision:
                return (
                    <div></div>
                )
            default:
                return (
                    <div className='absolute left-0 top-3.5 flex size-4 items-center justify-center rounded-full bg-gray-400 text-white'>
                        <InfoIcon />
                    </div>
                )
        }
    }

    const renderStepperBadge = (step: BookingApprovalStatus) => {
        switch (step) {
            case BookingApprovalStatus.Approved:
                return (<span className="self-center text-[10px] tracking-wide px-2 py-0.5 rounded-full font-semibold bg-green-100 text-green-700">APPROVED</span>)
            case BookingApprovalStatus.Rejected:
                return (<span className="self-center text-[10px] tracking-wide px-2 py-0.5 rounded-full font-semibold bg-red-100 text-red-700">REJECTED</span>)
            case BookingApprovalStatus.Revision:
                return (<span className="self-center text-[10px] tracking-wide px-2 py-0.5 rounded-full font-semibold bg-yellow-100 text-yellow-700">REVISION</span>)
            default:
                return (<span className="self-center text-[10px] tracking-wide px-2 py-0.5 rounded-full font-semibold bg-gray-100 text-gray-500">PENDING</span>)
        }
    }


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button disabled={bookingStepsLoading} className='w-full sm:w-fit'>
                    <Info />
                    {bookingStepsLoading ? 'Loading...' : 'Proses Pengajuan'}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Proses Pengajuan</DialogTitle>
                    <DialogDescription>
                        Lihat tahapan dan status persetujuan pengajuan Anda di bawah ini.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className='h-full max-h-[70vh] lg:max-h-[75vh]'>
                    <div className="relative mx-auto">
                        {bookingSteps.map((step, index) => (
                            <div key={index} className="relative pl-8 pb-8">
                                {bookingSteps.length > index + 1 && (
                                    <Separator
                                        orientation="vertical"
                                        className="bg-muted absolute left-2 top-4"
                                    />
                                )}
                                {getStepperStatus(step.status)}
                                <div className='flex flex-col'>
                                    <span className="pt-2 text-lg font-bold tracking-tight flex items-center gap-2">
                                        {step.formatedRoleLabel()} {step.action !== BookingApprovalAction.Finish && renderStepperBadge(step.status)}
                                    </span>
                                    {step.action !== BookingApprovalAction.Finish ? (
                                        <>
                                            <div className='text-sm text-muted-foreground'>{step.description}</div>
                                            {(step.status !== BookingApprovalStatus.Pending) ? (
                                                <>

                                                    <div className="text-sm mt-2">
                                                        <span className='font-semibold'>
                                                            {step.role === 'pemohon' ? 'Diajukan oleh' : 'Diverifikasi oleh'}
                                                        </span>
                                                        : {step.approver ?? '—'}
                                                    </div>
                                                    <span className="text-sm text-muted-foreground rounded-xl tracking-tight">
                                                        {step.approvedAt ? String(step.approvedAt.formatForInformation()) : ''}
                                                    </span>
                                                    {step.role !== 'pemohon' && (
                                                        <div className='flex flex-col mt-2'>
                                                            <span className='text-sm font-semibold'>
                                                                {step.status === BookingApprovalStatus.Rejected ? 'Alasan: ' : 'Catatan:'}
                                                            </span>
                                                            <span className='text-sm'>
                                                                {step.information || 'Tidak ada catatan'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <span className='text-sm'>
                                                    Menunggu Persetujuan...
                                                </span>
                                            )}
                                        </>
                                    ) : (
                                        <span className='text-sm text-muted-foreground'>
                                            Pengajuan akan dinyatakan selesai setelah semua tahap disetujui.
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="secondary">Tutup</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default BookingStepperDialog