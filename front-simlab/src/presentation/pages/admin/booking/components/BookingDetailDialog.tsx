import { Button } from "@/presentation/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/presentation/components/ui/dialog"
import { BookingView } from '@/application/booking/BookingView'
import React from 'react'

interface BookingDetailDialogProps {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    booking: BookingView | undefined
}

const BookingDetailDialog: React.FC<BookingDetailDialogProps> = ({ booking, open, onOpenChange }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl grid-rows-[auto_minmax(0,1fr)_auto] max-h-[90dvh] p-0">
                <DialogHeader className="px-6 pt-6">
                    <DialogTitle>Informasi Peminjaman</DialogTitle>
                    <DialogDescription>

                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col px-6 gap-5 overflow-y-scroll scrollbar-hidden">
                    {booking && (
                        <>
                            <div className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nama Peminjam</label>
                                        <span className="text-sm font-medium text-gray-800">{booking.user?.name}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nomor Identitas Peminjam</label>
                                        <span className="text-sm font-medium text-gray-800">{booking.user?.identityNum}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Program Studi</label>
                                        <span className="text-sm font-medium text-gray-800">{booking.user?.studyProgram?.name}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nomor Hp (Whatsapp)</label>
                                        <span className="text-sm font-medium text-gray-800">{booking.phoneNumber}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Judul Proyek / Penelitian</label>
                                        <span className="text-sm font-medium text-gray-800">{booking.purpose}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Judul Proyek / Penelitian</label>
                                        <span className="text-sm font-medium text-gray-800">{booking.activityName}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Dosen Pembimbing</label>
                                        <span className="text-sm font-medium text-gray-800">{booking.supervisor ?? '-'}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email Dosen Pembimbing</label>
                                        <span className="text-sm font-medium text-gray-800">{booking.supervisorEmail ?? '-'}</span>
                                    </div>
                                    <div className="flex flex-col md:col-span-2 gap-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Surat Pengantar / Berkas Pendukung</label>
                                        {booking.supportingFile ? (
                                            <a href={`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/${booking.supportingFile}`} className='w-full' target='_blank'>
                                                <Button className='w-full'>Open File</Button>
                                            </a>
                                        ) : (
                                            <Button variant={'secondary'}>N/A</Button>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1 md:col-span-2">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Jenis Peminjaman</label>
                                        <span className="text-sm font-medium text-gray-800">{booking.getFormattedBookingType()}</span>
                                    </div>
                                    <div className="flex flex-col gap-1 md:col-span-2">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Jadwal Peminjaman</label>
                                        <div className="bg-gradient-to-r from-primary/70 to-primary text-white p-3 rounded-xl text-center">
                                            <div className="text-xs opacity-90 mb-2 uppercase tracking-wide">Jadwal Peminjaman</div>
                                            <div className="text-lg font-semibold mb-1">{booking?.startTime.formatForInformation()}</div>
                                            <div className="text-base flex items-center justify-center gap-1">
                                                S/D
                                            </div>
                                            <div className="text-lg font-semibold mb-1">{booking?.endTime.formatForInformation()}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <DialogFooter className="p-6">
                    <DialogClose asChild>
                        <Button type="button" variant='secondary'>
                            Close
                        </Button>
                    </DialogClose>
                    {/* <Button type="button" variant={confirmVariant} onClick={submit}>
                        {isLoading ? 'Submitting...' : 'Continue'}
                    </Button> */}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default BookingDetailDialog
