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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/presentation/components/ui/select'

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

    const [selectedStatus, setSelectedStatus] = useState<string>('')
    const handleFilterStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;

        setSelectedStatus(value);
        setCurrentPage(1);
    }

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
        setTotalItems,
        status: selectedStatus
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
    }, [currentPage, perPage, selectedStatus])

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

    const handleVerification = async (action: 'approve' | 'reject' | 'revision', information: string, laboratory_room_id?: number, is_allowed_offsite?: boolean | null): Promise<void> => {
        if (!selectedBooking) return
        const res = await verifyBooking(selectedBooking.id, {
            action: action,
            information: information,
            laboratory_room_id: laboratory_room_id,
            is_allowed_offsite: is_allowed_offsite
        })
        toast.success(res.message)
        setOpenRejectionDialog(false)
        setOpenApprovalDialog(false);
        setOpenEquipmentDialog(false);
        setSelectedBooking(null);
        getDataForVerification()
    }

    return (
        <>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0" ref={sectionRef}>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Verifikasi Peminjaman</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full mb-3 md:w-1/3">
                            <div className="relative">
                                <Select name='filter_status' onValueChange={(value) =>
                                    handleFilterStatus({
                                        target: {
                                            name: 'filter_status',
                                            value: value
                                        }
                                    } as React.ChangeEvent<HTMLSelectElement>)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Status</SelectLabel>
                                            <SelectItem value=" ">All</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="rejected">Rejected</SelectItem>
                                            <SelectItem value="approved">Approved</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
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
                <LaboranBookingApprovalDialog open={openApprovalDialog} onOpenChange={setOpenApprovalDialog} handleSave={handleVerification} />
                <LaboranBookingApprovalEquipmentDialog open={openEquipmentDialog} onOpenChange={setOpenEquipmentDialog} handleSave={handleVerification} />
            </div>
        </>
    )
}

export default LaboranBookingApproval
