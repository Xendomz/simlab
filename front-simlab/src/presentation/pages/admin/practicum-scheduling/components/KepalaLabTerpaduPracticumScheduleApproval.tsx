import { useRef, useState } from 'react'
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react'
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import Table from '@/presentation/components/Table';
import { PracticumScheduleVerificationColumn } from '../column/PracticumScheduleVerificationColumn';
import RejectionDialog from '@/presentation/components/custom/RejectionDialog';
import { userRole } from '@/domain/User/UserRole';
import ApproveWithLaboranSelectDialog from '@/presentation/components/custom/ApproveWithLaboranSelectDialog';
import { useDepedencies } from '@/presentation/contexts/useDepedencies';
import { usePracticumSchedulingVerificationDataTable } from '../hooks/usePracticumSchedulingVerificationDataTable';

const KepalaLabTerpaduPracticumScheduleApproval = () => {
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

  const [id, setId] = useState<number | null>(null)
  const [openApprovalDialog, setOpenApprovalDialog] = useState<boolean>(false)
  const [openRejectionDialog, setOpenRejectionDialog] = useState<boolean>(false)

  const openApproval = (id: number) => {
    setId(id)
    setOpenApprovalDialog(true)
  }

  const openRejection = (id: number) => {
    setId(id)
    setOpenRejectionDialog(true)
  }

  const handleApproval = async (laboran_id: number, information: string): Promise<void> => {
    if (!id) return
    const res = await practicumSchedulingService.verify(id, {
      action: 'approve',
      laboran_id: laboran_id,
      information: information
    })
    toast.success(res.message)
    setOpenApprovalDialog(false)
    refresh()
  }

  const handleRejection = async (information: string): Promise<void> => {
    if (!id) return
    const res = await practicumSchedulingService.verify(id, {
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
              columns={PracticumScheduleVerificationColumn({ role: userRole.KepalaLabTerpadu, openApproval, openRejection })}
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
        <ApproveWithLaboranSelectDialog open={openApprovalDialog} onOpenChange={setOpenApprovalDialog} handleSave={handleApproval} />
        <RejectionDialog open={openRejectionDialog} onOpenChange={setOpenRejectionDialog} handleRejection={handleRejection} />
      </div>
    </>
  )
}

export default KepalaLabTerpaduPracticumScheduleApproval