import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useRef, useState } from 'react'
import Table from '../../../../components/Table'
import { LaboranColumn } from './LaboranColumn'
import { toast } from 'sonner'
import { ModalType } from '@/shared/Types'
import { UserInputDTO } from '@/application/user/UserDTO'
import Header from '@/presentation/components/Header'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Button } from '@/presentation/components/ui/button'
import { Plus } from 'lucide-react'
import ConfirmationDialog from '@/presentation/components/custom/ConfirmationDialog'
import LaboranFormDialog from './components/LaboranFormDialog'
import { userRole } from '@/domain/User/UserRole'
import { useUserDataTable } from '../hooks/useUserDataTable'
import { useDepedencies } from '@/presentation/contexts/useDepedencies'

const LaboranPage = () => {
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

    const { userService } = useDepedencies()
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
    } = useUserDataTable({ filter_study_program: 0, role: userRole.Laboran })

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
            <Header title='Menu Laboran' />
            <div className="flex flex-col gap-4 p-4 pt-0" ref={sectionRef}>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Laboran</CardTitle>
                        <CardAction>
                            <Button variant={"default"} onClick={() => openModal('Add')}>
                                Tambah
                                <Plus />
                            </Button>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <Table
                            data={users}
                            columns={LaboranColumn({ openModal, openConfirm })}
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
                <LaboranFormDialog
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    data={users}
                    dataId={id}
                    handleSave={handleSave}
                    title={type == 'Add' ? 'Tambah Laboran' : 'Edit Laboran'}
                />
            </div>
        </>
    )
}

export default LaboranPage
