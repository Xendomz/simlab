import useTable from '@/application/hooks/useTable'
import { UserInputDTO } from '@/application/user/dto/UserDTO'
import { useUser } from '@/application/user/hooks/useUser'
import Header from '@/presentation/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { ModalType } from '@/shared/Types'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import ConfirmationDialog from '@/presentation/components/custom/ConfirmationDialog'
import { KepalaLabUnitColumn } from './KepalaLabUnitColumn'
import Table from '@/presentation/components/Table'
import KepalaLabUnitFormDialog from './components/KepalaLabUnitFormDialog'
import { useStudyProgram } from '@/application/study-program/hooks/useStudyProgram'

const KepalaLabUnitPage = () => {
    const sectionRef = useRef(null)

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
        studyProgram,
        getData: getStudyProgramData,
    } = useStudyProgram({
        currentPage: 1,
        perPage: 9999,
        searchTerm: '',
        setTotalPages() { },
        setTotalItems() { }
    })

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [id, setId] = useState<number | null>(null)
    const [type, setType] = useState<ModalType>('Add')
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false)

    const {
        user,
        isLoading,
        getData,
        update,
        restoreToDosen
    } = useUser({
        currentPage,
        perPage,
        role: 'Kepala Lab Unit',
        filter_study_program: 0,
        searchTerm,
        setTotalPages,
        setTotalItems
    })

    useEffect(() => {
        getStudyProgramData()
    }, [])

    useEffect(() => {
        getData()
    }, [currentPage, perPage])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentPage === 1) {
                getData()
            } else {
                setCurrentPage(1)
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTerm])

    const openModal = (modalType: ModalType, id: number | null = null) => {
        setId(null)
        setType(modalType)
        setId(id)
        setIsOpen(true)
    }

    const openConfirm = (id: number) => {
        setId(id)
        setConfirmOpen(true)
    }

    const handleSave = async (formData: UserInputDTO): Promise<void> => {
        try {
            if (!id) return
            const res = await update(id, formData)
            toast.success(res.message)
            getData()
            setIsOpen(false)
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const handleRestoreDosen = async () => {
        if (!id) return
        const res = await restoreToDosen(id)
        toast.success(res.message)

        getData()
        setConfirmOpen(false)
    }

    return (
        <>
            <Header title='Menu Kepala Lab. Unit' />
            <div className="flex flex-col gap-4 p-4 pt-0" ref={sectionRef}>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Kepala Lab. Unit</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table
                            data={user}
                            columns={KepalaLabUnitColumn({ openModal, openConfirm })}
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
                <ConfirmationDialog open={confirmOpen} onOpenChange={setConfirmOpen} onConfirm={handleRestoreDosen} />
                <KepalaLabUnitFormDialog
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    data={user}
                    studyProgram={studyProgram}
                    dataId={id}
                    handleSave={handleSave}
                    title={type == 'Add' ? 'Tambah Dosen' : 'Edit Dosen'}
                />
            </div>
        </>
    )
}

export default KepalaLabUnitPage
