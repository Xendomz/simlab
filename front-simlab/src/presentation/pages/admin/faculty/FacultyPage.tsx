import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react"
import { useRef, useState } from 'react';
import Header from '@/presentation/components/Header';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Button } from '@/presentation/components/ui/button';
import { Plus } from 'lucide-react';
import Table from '@/presentation/components/Table';
import { FacultyColumn } from './FacultyColumn';
import { ModalType } from '@/shared/Types';
import { FacultyInputDTO } from '@/application/faculty/FacultyDTO';
import { toast } from 'sonner';
import ConfirmationDialog from '@/presentation/components/custom/ConfirmationDialog';
import FacultyFormDialog from './components/FacultyFormDialog';
import { useDepedencies } from '@/presentation/contexts/useDepedencies';
import { useFacultyDataTable } from './hooks/useFacultyDataTable';

const FacultyPage = () => {
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

    const { facultyService } = useDepedencies()
    const {
        faculties,
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
    } = useFacultyDataTable()

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

    const handleSave = async (formData: FacultyInputDTO): Promise<void> => {
        if (id) {
            const res = await facultyService.updateData(id, formData)
            toast.success(res.message)
        } else {
            const res = await facultyService.createData(formData)
            toast.success(res.message)
        }

        refresh()
        setIsOpen(false)
    }

    const handleDelete = async () => {
        if (!id) return
        const res = await facultyService.deleteData(id)
        toast.success(res.message)

        refresh()
        setConfirmOpen(false)
    }

    return (
        <>
            <Header title='Menu Fakultas' />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0" ref={sectionRef}>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Fakultas</CardTitle>
                        <CardAction>
                            <Button variant={"default"} onClick={() => openModal('Add')}>
                                Tambah
                                <Plus />
                            </Button>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <Table
                            data={faculties}
                            columns={FacultyColumn({ openModal, openConfirm })}
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
            </div>
            <ConfirmationDialog open={confirmOpen} onOpenChange={setConfirmOpen} onConfirm={handleDelete} />
            <FacultyFormDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                data={faculties}
                dataId={id}
                handleSave={handleSave}
                title={type == 'Add' ? 'Tambah Fakultas' : 'Edit Fakultas'}
            />
        </>
    )
}

export default FacultyPage