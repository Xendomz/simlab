import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react'
import React, { useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import Table from '@/presentation/components/Table';
import { BookingVerificationColumn } from '../column/BookingVerificationColumn';
import { toast } from 'sonner';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/presentation/components/ui/select'
import { useBookingVerificationDataTable } from '../hooks/useBookingVerificationDataTable';
import { useDepedencies } from '@/presentation/contexts/useDepedencies';
import { userRole } from '@/domain/User/UserRole';
import ApproveWithLaboranSelectDialog from '@/presentation/components/custom/ApproveWithLaboranSelectDialog';
import RejectionDialog from '@/presentation/components/custom/RejectionDialog';

const KepalaLabBookingApproval = () => {
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

    const {bookingService} = useDepedencies()
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
        setCurrentPage,
      } = useBookingVerificationDataTable({filter_status: selectedStatus})

    const [selectedBookingId, setSelectedBookingId] = useState<number>(0);
    const [openApprovalDialog, setOpenApprovalDialog] = useState<boolean>(false)
    const [openRejectionDialog, setOpenRejectionDialog] = useState<boolean>(false)

    const openApproval = (id: number) => {
        setSelectedBookingId(id);
        setOpenApprovalDialog(true)
    }

    const openRejection = (id: number) => {
        setSelectedBookingId(id);
        setOpenRejectionDialog(true)
    }

    const handleApproval = async (laboran_id: number, information: string): Promise<void> => {
        if (selectedBookingId) {
            const res = await bookingService.verifyBooking(selectedBookingId, {
                action: 'approve',
                information: information,
                laboran_id: laboran_id
            })
            toast.success(res.message)
            setOpenApprovalDialog(false)
            refresh()
        }
    }

    const handleRejection = async (information: string): Promise<void> => {
        if (selectedBookingId) {
            const res = await bookingService.verifyBooking(selectedBookingId, {
                action: 'reject',
                information: information
            })
            toast.success(res.message)
            setOpenRejectionDialog(false)
            refresh()
        }
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
                            data={bookings}
                            columns={BookingVerificationColumn({ role: userRole.KepalaLabTerpadu, openApproval, openRejection })}
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
                <ApproveWithLaboranSelectDialog open={openApprovalDialog} onOpenChange={setOpenApprovalDialog} handleSave={handleApproval}/>
            </div>
        </>
    )
}

export default KepalaLabBookingApproval
