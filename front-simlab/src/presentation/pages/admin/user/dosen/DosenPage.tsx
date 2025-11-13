import { gsap } from 'gsap';
import Header from '@/presentation/components/Header'
import Table from '@/presentation/components/Table'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { useGSAP } from '@gsap/react'
import { useRef, useState } from 'react'
import { DosenColumn } from './DosenColumn'
import { ModalType } from '@/shared/Types'
import ConfirmationDialog from '@/presentation/components/custom/ConfirmationDialog'
import { toast } from 'sonner';
import { UserInputDTO } from '@/application/user/UserDTO';
import { Button } from '@/presentation/components/ui/button';
import { Plus } from 'lucide-react';
import DosenFormDialog from './components/DosenFormDialog';
import { Combobox } from '@/presentation/components/custom/combobox';
import { userRole } from '@/domain/User/UserRole';
import { useDepedencies } from '@/presentation/contexts/useDepedencies';
import { useStudyProgramSelect } from '../../study-program/hooks/useStudyProgramSelect';
import { useUserDataTable } from '../hooks/useUserDataTable';

const DosenPage = () => {
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

    const { userService } = useDepedencies()
    const { studyPrograms, selectedStudyProgram, setSelectedStudyProgram } = useStudyProgramSelect()
    const {
        users,
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
    } = useUserDataTable({ filter_study_program: selectedStudyProgram, role: userRole.Dosen })

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [id, setId] = useState<number | null>(null)
    const [type, setType] = useState<ModalType>('Add')
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false)

    const openModal = (modalType: ModalType, id: number | null = null) => {
        setType(modalType)
        setId(id)
        setIsOpen(true)
    }

    const openConfirm = (id: number) => {
        setId(id)
        setConfirmOpen(true)
    }

    const handleSave = async (formData: UserInputDTO): Promise<void> => {
        if (id) {
            const res = await userService.updateData(id, formData)
            toast.success(res.message)
        } else {
            const res = await userService.createData(formData)
            toast.success(res.message)
        }
        refresh()
        setIsOpen(false)
    }

    const handleDelete = async () => {
        if (!id) return
        const res = await userService.deleteData(id)
        toast.success(res.message)

        refresh()
        setConfirmOpen(false)
    }

    return (
        <>
            <Header title='Menu Dosen' />
            <div className="flex flex-col gap-4 p-4 pt-0" ref={sectionRef}>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Dosen</CardTitle>
                        <CardAction>
                            <Button variant={"default"} onClick={() => openModal('Add')}>
                                Tambah
                                <Plus />
                            </Button>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full mb-3 md:w-1/3">
                            <div className="relative">
                                <Combobox
                                    options={studyPrograms}
                                    value={selectedStudyProgram?.toString() || ''}
                                    onChange={(val) => {
                                        setSelectedStudyProgram(val ? Number(val) : 0)
                                        setCurrentPage(1)
                                    }}
                                    placeholder="Pilih Prodi"
                                    optionLabelKey='name'
                                    optionValueKey='id'
                                    isFilter
                                />
                            </div>
                        </div>
                        <Table
                            data={users}
                            columns={DosenColumn({ openModal, openConfirm })}
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
                <ConfirmationDialog open={confirmOpen} onOpenChange={setConfirmOpen} onConfirm={handleDelete} />
                <DosenFormDialog
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    data={users}
                    studyPrograms={studyPrograms}
                    dataId={id}
                    handleSave={handleSave}
                    title={type == 'Add' ? 'Tambah Dosen' : 'Edit Dosen'}
                />
            </div>
        </>
    )
}

export default DosenPage
