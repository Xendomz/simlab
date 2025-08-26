import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react'
import useTable from '@/application/hooks/useTable';
import { usePracticumScheduling } from '@/application/practicum-scheduling/hooks/usePracticumScheduling';
import { PracticumSchedulingVerifyDTO } from '@/application/practicum-scheduling/dto/PracticumSchedulingDTO';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import Table from '@/presentation/components/Table';
import { PracticumScheduleVerificationColumn } from '../column/PracticumScheduleVerificationColumn';
import KoorprodiPracticumScheduleApprovalDialog from './KoorprodiPracticumScheduleApprovalDialog';

const KoorprodiPraticumScheduleApproval = () => {
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
        practicumScheduling,
        isLoading,
        getDataForVerification,
        verify
    } = usePracticumScheduling({
        currentPage,
        perPage,
        searchTerm,
        setTotalPages,
        setTotalItems
    })

    const [id, setId] = useState<number | null>(null)
    const [openApprovalDialog, setOpenApprovalDialog] = useState<boolean>(false)

    const openApproval = (id: number) => {
        setId(id)
        setOpenApprovalDialog(true)
    }

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

    const handleApproval = async (data: PracticumSchedulingVerifyDTO): Promise<void> => {
        if (id) {
            const res = await verify(id, data)
            toast.success(res.message)
            setOpenApprovalDialog(false)
            getDataForVerification()
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
                        <Table
                            data={practicumScheduling}
                            columns={PracticumScheduleVerificationColumn({ role: 'Koorprodi', openApproval })}
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
                {/* <BookingRejectionDialog open={openRejectionDialog} onOpenChange={setOpenRejectionDialog} handleRejection={handleRejection} /> */}
                <KoorprodiPracticumScheduleApprovalDialog onOpenChange={setOpenApprovalDialog} open={openApprovalDialog} handleSave={handleApproval}/>
                {/* <KepalaLabBookingApprovalDialog open={openApprovalDialog} onOpenChange={setOpenApprovalDialog} handleSave={handleApproval} /> */}
            </div>
        </>
    )
}

export default KoorprodiPraticumScheduleApproval