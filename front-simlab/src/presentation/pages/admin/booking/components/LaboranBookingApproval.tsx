import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react'
import React, { useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import Table from '@/presentation/components/Table';
import { BookingVerificationColumn } from '../column/BookingVerificationColumn';
import { toast } from 'sonner';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/presentation/components/ui/select'
import { useDepedencies } from '@/presentation/contexts/useDepedencies';
import { useBookingVerificationDataTable } from '../hooks/useBookingVerificationDataTable';
import { userRole } from '@/domain/User/UserRole';
import RejectionDialog from '@/presentation/components/custom/RejectionDialog';
import ApproveDialog from '@/presentation/components/custom/ApproveDialog';

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

    const [selectedStatus, setSelectedStatus] = useState<string>('')
    const handleFilterStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;

        setSelectedStatus(value);
        setCurrentPage(1);
    }

    const { bookingService } = useDepedencies()
    const {
        bookings,
        isLoading,
        searchTerm,
        refresh,

        // TableHandler
        perPage,
        handleSearch,
        handlePageChange,
        handlePerPageChange,
        totalItems,
        totalPages,
        currentPage,
        setCurrentPage
    } = useBookingVerificationDataTable({ filter_status: selectedStatus })

    const [selectedBookingId, setSelectedBookingId] = useState<number>(0);
    const [openApprovalDialog, setOpenApprovalDialog] = useState<boolean>(false);
    // const [openEquipmentDialog, setOpenEquipmentDialog] = useState<boolean>(false);
    const [openRejectionDialog, setOpenRejectionDialog] = useState<boolean>(false);

    const openApproval = (id: number) => {
        setSelectedBookingId(id);
        // if (booking.bookingType === BookingType.Equipment) {
        //     setOpenEquipmentDialog(true);
        // } else {
        // }
        setOpenApprovalDialog(true);
    };

    const openRejection = (id: number) => {
        setSelectedBookingId(id);
        setOpenRejectionDialog(true);
    };

    const handleApproval = async (information: string): Promise<void> => {
        if (!selectedBookingId) return
        const res = await bookingService.verifyBooking(selectedBookingId, {
            action: 'approve',
            information: information
        });
        toast.success(res.message);
        setOpenApprovalDialog(false);
        // setOpenEquipmentDialog(false);
        setSelectedBookingId(0);
        refresh();
    };

    const handleRejection = async (information: string): Promise<void> => {
        if (!selectedBookingId) return
        const res = await bookingService.verifyBooking(selectedBookingId, {
            action: 'reject',
            information: information
        });
        toast.success(res.message);
        setOpenRejectionDialog(false);
        setSelectedBookingId(0);
        refresh();
    };

    // const handleVerification = async (action: 'approve' | 'reject' | 'revision', information: string, laboratory_room_id?: number, is_allowed_offsite?: boolean | null): Promise<void> => {
    //     if (!selectedBooking) return
    //     const res = await verifyBooking(selectedBooking.id, {
    //         action: action,
    //         information: information,
    //         laboratory_room_id: laboratory_room_id,
    //         is_allowed_offsite: is_allowed_offsite
    //     })
    //     toast.success(res.message)
    //     setOpenRejectionDialog(false)
    //     setOpenApprovalDialog(false);
    //     setOpenEquipmentDialog(false);
    //     setSelectedBooking(null);
    //     getDataForVerification()
    // }

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
                            data={bookings}
                            columns={BookingVerificationColumn({ role: userRole.Laboran, openApproval, openRejection })}
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
                <RejectionDialog open={openRejectionDialog} onOpenChange={setOpenRejectionDialog} handleRejection={handleRejection} />
                <ApproveDialog open={openApprovalDialog} onOpenChange={setOpenApprovalDialog} handleSave={handleApproval} />
                {/* <BookingRejectionDialog open={openRejectionDialog} onOpenChange={setOpenRejectionDialog} handleRejection={handleRejection} />
                <LaboranBookingApprovalDialog open={openApprovalDialog} onOpenChange={setOpenApprovalDialog} handleSave={handleVerification} /> */}
                {/* <LaboranBookingApprovalEquipmentDialog open={openEquipmentDialog} onOpenChange={setOpenEquipmentDialog} handleSave={handleVerification} /> */}
            </div>
        </>
    )
}

export default LaboranBookingApproval
