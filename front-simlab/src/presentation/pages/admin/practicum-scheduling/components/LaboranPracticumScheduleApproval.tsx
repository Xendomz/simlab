import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react'
import useTable from '@/application/hooks/useTable';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import Table from '@/presentation/components/Table';
import { PracticumScheduleVerificationColumn } from '../column/PracticumScheduleVerificationColumn';
import { PracticumSchedulingService } from '@/application/practicum-scheduling/PracticumSchedulingService';
import { PracticumSchedulingView } from '@/application/practicum-scheduling/PracticumSchedulingView';
import { userRole } from '@/domain/User/UserRole';
import RejectionDialog from '@/presentation/components/custom/RejectionDialog';
import ApproveWithLaboratoryMaterialRealizationDialog from '@/presentation/components/custom/ApproveWithLaboratoryMaterialRealizationDialog';

const LaboranPracticumScheduleApproval = () => {
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


    const practicumSchedulingService = new PracticumSchedulingService()
    const [practicumSchedulings, setPracticumSchedulings] = useState<PracticumSchedulingView[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const getDataForVerification = async () => {
        setIsLoading(true)
        const response = await practicumSchedulingService.getPracticumSchedulingForVerification({
            page: currentPage,
            per_page: perPage,
            search: searchTerm
        })
        setPracticumSchedulings(response.data ?? [])
        setTotalPages(response.last_page ?? 0)
        setTotalItems(response.total ?? 0)
        setIsLoading(false)
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

    const [id, setId] = useState<number | null>(null)
    const [openApprovalDialog, setOpenApprovalDialog] = useState<boolean>(false)
    const [openRejectionDialog, setOpenRejectionDialog] = useState<boolean>(false)
    const [selectedPracticumScheduling, setSelectedPracticumScheduling] = useState<PracticumSchedulingView>()

    const openApproval = (id: number) => {
        setId(id)
        setSelectedPracticumScheduling(practicumSchedulings.find((practicumScheduling) => practicumScheduling.id === id))
        setOpenApprovalDialog(true)
    }

    const openRejection = (id: number) => {
        setId(id)
        setOpenRejectionDialog(true)
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

    const handleApproval = async (information: string, materials: number[]): Promise<void> => {
        if (!id) return;
        const res = await practicumSchedulingService.verify(id, {
            action: 'approve',
            information: information,
            materials: materials
        })
        toast.success(res.message)
        setOpenApprovalDialog(false)
        getDataForVerification()
    }

    const handleRejection = async (information: string): Promise<void> => {
        if (!id) return;
        const res = await practicumSchedulingService.verify(id, {
            action: 'reject',
            information: information
        })
        toast.success(res.message)
        setOpenRejectionDialog(false)
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
                        <Table
                            data={practicumSchedulings}
                            columns={PracticumScheduleVerificationColumn({ role: userRole.Laboran, openApproval, openRejection })}
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
                <ApproveWithLaboratoryMaterialRealizationDialog practicumScheduling={selectedPracticumScheduling} open={openApprovalDialog} onOpenChange={setOpenApprovalDialog} handleSave={handleApproval}/>
                <RejectionDialog open={openRejectionDialog} onOpenChange={setOpenRejectionDialog} handleRejection={handleRejection} />
            </div>
        </>
    )
}

export default LaboranPracticumScheduleApproval