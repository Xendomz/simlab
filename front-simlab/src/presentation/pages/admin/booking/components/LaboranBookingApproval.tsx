import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react'
import React, { useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import Table from '@/presentation/components/Table';
import { BookingVerificationColumn } from '../column/BookingVerificationColumn';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/presentation/components/ui/select'
import { useBookingVerificationDataTable } from '../hooks/useBookingVerificationDataTable';
import { userRole } from '@/domain/User/UserRole';
import RejectionDialog from '@/presentation/components/custom/RejectionDialog';
import ApproveDialog from '@/presentation/components/custom/ApproveDialog';
import { BookingType } from '@/domain/booking/BookingType';
import { useBookingVerification } from '../hooks/useBookingVerification';
import ApproveEquipmentDialog from '@/presentation/components/custom/ApproveEquipmentDialog';

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

    const {
        setSelectedBookingId,
        openApprovalDialog,
        setOpenApprovalDialog,
        openRejectionDialog,
        setOpenRejectionDialog,
        openReturnVerificationDialog,
        setOpenReturnVerificationDialog,
        setOpenReturnConfirmationDialog,
        openReturnConfirmationDialog,

        handleApproval,
        handleRejection,
        handleEquipmentApproval,
        handleReturnVerification
    } = useBookingVerification(refresh)
    const [approvalType, setApprovalType] = useState<'equipment_approve' | 'approve' | null>(null)

    const openReturnVerification = (id: number) => {
        setSelectedBookingId(id);
        const selectedBooking = bookings.find((booking) => booking.id === id)
        setApprovalType(selectedBooking?.bookingType === BookingType.Equipment ? 'equipment_approve' : 'approve')
        setOpenReturnVerificationDialog(true)
    }

    const openReturnConfirmation = (id: number) => {
        setSelectedBookingId(id);
        const selectedBooking = bookings.find((booking) => booking.id === id)
        setApprovalType(selectedBooking?.bookingType === BookingType.Equipment ? 'equipment_approve' : 'approve')
        setOpenReturnConfirmationDialog(true)
    }

    const openApproval = (id: number) => {
        setSelectedBookingId(id);
        const selectedBooking = bookings.find((booking) => booking.id === id)
        setApprovalType(selectedBooking?.bookingType === BookingType.Equipment ? 'equipment_approve' : 'approve')
        setOpenApprovalDialog(true);
    };

    const openRejection = (id: number) => {
        setSelectedBookingId(id);
        setOpenRejectionDialog(true);
    };

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
                            columns={BookingVerificationColumn({ role: userRole.Laboran, openApproval, openRejection, openReturnVerification, openReturnConfirmation })}
                            loading={isLoading}
                            searchTerm={searchTerm}
                            handleSearch={(e) => handleSearch(e)}
                            perPage={perPage}
                            handlePerPageChange={(e) => handlePerPageChange(e)}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            currentPage={currentPage}
                            handlePageChange={handlePageChange} 
                            handleRefresh={refresh}/>
                    </CardContent>
                </Card>
                <RejectionDialog open={openRejectionDialog} onOpenChange={setOpenRejectionDialog} handleRejection={handleRejection} />
                {approvalType === 'equipment_approve' ? (
                    <>
                        <ApproveEquipmentDialog open={openApprovalDialog} onOpenChange={setOpenApprovalDialog} handleSave={handleEquipmentApproval} />
                        <ApproveDialog
                            open={openReturnVerificationDialog}
                            onOpenChange={setOpenReturnVerificationDialog}
                            handleSave={handleReturnVerification}
                            title='Verifikasi Pengembalian'
                            message='Apakah anda yakin ingin melakukan verifikasi pengembalian?'
                        />
                        <ApproveDialog
                            open={openReturnConfirmationDialog}
                            onOpenChange={setOpenReturnConfirmationDialog}
                            handleSave={handleApproval}
                            title='Konfirmasi Pengembalian'
                            message='Apakah anda yakin ingin melakukan konfirmasi pengembalian?'
                        />
                    </>
                ) : (
                    <ApproveDialog open={openApprovalDialog} onOpenChange={setOpenApprovalDialog} handleSave={handleApproval} />
                )}
            </div>
        </>
    )
}

export default LaboranBookingApproval
