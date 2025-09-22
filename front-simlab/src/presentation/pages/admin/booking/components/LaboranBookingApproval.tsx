import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react'
import React, { useEffect, useRef, useState } from 'react'
import useTable from '@/application/hooks/useTable';
import { useBooking } from '@/application/booking/hooks/useBooking';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import Table from '@/presentation/components/Table';
import { BookingVerificationColumn } from '../column/BookingVerificationColumn';
import { BookingVerifyDTO } from '@/application/booking/dto/BookingDTO';
import { toast } from 'sonner';
import BookingRejectionDialog from './BookingRejectionDialog';
import LaboranBookingApprovalDialog from './LaboranBookingApprovalDialog';
import LaboranBookingApprovalEquipmentDialog from './LaboranBookingApprovalEquipmentDialog';
import { BookingType } from '@/domain/booking/BookingType';
import { BookingView } from '@/application/booking/BookingView';

const LaboranBookingApproval = () => {
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

    const {
        currentPage,
        perPage,
        totalPages,
        totalItems,
        searchTerm,

        setTotalPages,
        setTotalItems,
        setCurrentPage,

        handleSearch,
        handlePerPageChange,
        handlePageChange,
    } = useTable()

    const {
        booking,
        isLoading,
        getDataForVerification,
        verifyBooking
    } = useBooking({
        currentPage,
        perPage,
        searchTerm,
        setTotalPages,
        setTotalItems
    })

    const [selectedBooking, setSelectedBooking] = useState<BookingView | null>(null);
    const [openApprovalDialog, setOpenApprovalDialog] = useState<boolean>(false);
    const [openEquipmentDialog, setOpenEquipmentDialog] = useState<boolean>(false);
    const [openRejectionDialog, setOpenRejectionDialog] = useState<boolean>(false);

    const openApproval = (booking: BookingView) => {
        setSelectedBooking(booking);
        if (booking.bookingType === BookingType.Equipment) {
            setOpenEquipmentDialog(true);
        } else {
            setOpenApprovalDialog(true);
        }
    };

    const openRejection = (booking: BookingView) => {
        setSelectedBooking(booking);
        setOpenRejectionDialog(true);
    };

    useEffect(() => {
        getDataForVerification()
    }, [currentPage, perPage])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentPage === 1) {
                getDataForVerification()
            } else {
                setCurrentPage(1)
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTerm])


    const handleApproval = async (data: BookingVerifyDTO): Promise<void> => {
        if (selectedBooking) {
            const res = await verifyBooking(selectedBooking.id, data);
            toast.success(res.message);
            setOpenApprovalDialog(false);
            setOpenEquipmentDialog(false);
            setSelectedBooking(null);
            getDataForVerification();
        }
    };

    const handleRejection = async (data: BookingVerifyDTO): Promise<void> => {
        if (selectedBooking) {
            const res = await verifyBooking(selectedBooking.id, data);
            toast.success(res.message);
            setOpenRejectionDialog(false);
            setSelectedBooking(null);
            getDataForVerification();
        }
    };

    return (
        <>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0" ref={sectionRef}>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Verifikasi Peminjaman</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table
                            data={booking}
                            columns={BookingVerificationColumn({ role: 'Laboran', openApproval, openRejection })}
                            loading={isLoading}
                            searchTerm={searchTerm}
                            handleSearch={(e) => handleSearch(e)}
                            perPage={perPage}
                            handlePerPageChange={(e) => handlePerPageChange(e)}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            currentPage={currentPage}
                            handlePageChange={handlePageChange} />
                    </CardContent>
                </Card>
                <BookingRejectionDialog open={openRejectionDialog} onOpenChange={setOpenRejectionDialog} handleRejection={handleRejection} />
                <LaboranBookingApprovalDialog open={openApprovalDialog} onOpenChange={setOpenApprovalDialog} handleSave={handleApproval} />
                <LaboranBookingApprovalEquipmentDialog open={openEquipmentDialog} onOpenChange={setOpenEquipmentDialog} handleSave={handleApproval} />
            </div>
        </>
    )
}

export default LaboranBookingApproval
