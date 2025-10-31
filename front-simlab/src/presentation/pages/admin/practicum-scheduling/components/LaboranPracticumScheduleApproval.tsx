import { useRef, useState } from 'react'
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react'
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import Table from '@/presentation/components/Table';
import { PracticumScheduleVerificationColumn } from '../column/PracticumScheduleVerificationColumn';
import { PracticumSchedulingView } from '@/application/practicum-scheduling/PracticumSchedulingView';
import { userRole } from '@/domain/User/UserRole';
import RejectionDialog from '@/presentation/components/custom/RejectionDialog';
import ApproveWithLaboratoryMaterialRealizationDialog from '@/presentation/components/custom/ApproveWithLaboratoryMaterialRealizationDialog';
import { usePracticumSchedulingVerificationDataTable } from '../hooks/usePracticumSchedulingVerificationDataTable';
import { useDepedencies } from '@/presentation/contexts/useDepedencies';

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

    const { practicumSchedulingService } = useDepedencies()

    const {
        practicumSchedulings,
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
      } = usePracticumSchedulingVerificationDataTable()

    const [practicumSchedulingId, setPracticumSchedulingId] = useState<number | null>(null)
    const [openApprovalDialog, setOpenApprovalDialog] = useState<boolean>(false)
    const [openRejectionDialog, setOpenRejectionDialog] = useState<boolean>(false)
    const [selectedPracticumScheduling, setSelectedPracticumScheduling] = useState<PracticumSchedulingView>()

    const openApproval = (id: number) => {
        setPracticumSchedulingId(id)
        setSelectedPracticumScheduling(practicumSchedulings.find((practicumScheduling) => practicumScheduling.id === id))
        setOpenApprovalDialog(true)
    }

    const openRejection = (id: number) => {
        setPracticumSchedulingId(id)
        setOpenRejectionDialog(true)
    }

    const handleApproval = async (information: string, materials: number[]): Promise<void> => {
        if (!practicumSchedulingId) return;
        const res = await practicumSchedulingService.verify(practicumSchedulingId, {
            action: 'approve',
            information: information,
            materials: materials
        })
        toast.success(res.message)
        setOpenApprovalDialog(false)
        refresh()
    }

    const handleRejection = async (information: string): Promise<void> => {
        if (!practicumSchedulingId) return;
        const res = await practicumSchedulingService.verify(practicumSchedulingId, {
            action: 'reject',
            information: information
        })
        toast.success(res.message)
        setOpenRejectionDialog(false)
        refresh()
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