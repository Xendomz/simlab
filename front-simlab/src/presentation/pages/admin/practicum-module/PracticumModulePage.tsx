import { useRef, useState } from 'react'
import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import Header from '@/presentation/components/Header';
import { Button } from '@/presentation/components/ui/button';
import { Plus } from 'lucide-react';
import Table from '@/presentation/components/Table';
import { PracticumModuleColumn } from './PracticumModuleColumn';
import { ModalType } from '@/shared/Types';
import { toast } from 'sonner';
import { PracticumModuleInputDTO } from '@/application/practicum-module/PracticumModuleDTO';
import ConfirmationDialog from '@/presentation/components/custom/ConfirmationDialog';
import { Combobox } from '@/presentation/components/custom/combobox';
import PracticumModuleFormDialog from './components/PracticumModuleFormDialog';
import { usePracticumSelect } from '../practicum/hooks/usePracticumSelect';
import { usePracticumModuleDataTable } from './hooks/usePracticumModuleDataTable';
import { useDepedencies } from '@/presentation/contexts/useDepedencies';

const PracticumModulePage = () => {
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

    const { practicums, selectedPracticum, setSelectedPracticum } = usePracticumSelect()
    const { practicumModuleService } = useDepedencies()

    const {
        practicumModules,
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
    } = usePracticumModuleDataTable({ filter_practicum: selectedPracticum })

    const [isOpen, setIsOpen] = useState(false)
    const [id, setId] = useState<number | null>(null)
    const [type, setType] = useState<ModalType>('Add')

    const [confirmOpen, setConfirmOpen] = useState(false)
    const [confirmType, setConfirmType] = useState<"delete" | "status" | null>(null)

    const openModal = (modalType: ModalType, id: number | null = null) => {
        setType(modalType)
        setId(id)
        setIsOpen(true)
    }

    const openConfirm = (type: "delete" | "status", id: number) => {
        setConfirmType(type)
        setId(id)
        setConfirmOpen(true)
    }

    const handleSave = async (formData: PracticumModuleInputDTO): Promise<void> => {
        if (id) {
            const res = await practicumModuleService.updateData(id, formData)
            toast.success(res.message)
        } else {
            const res = await practicumModuleService.createData(formData)
            toast.success(res.message)
        }
        refresh()
        setId(null)
        setIsOpen(false)
    }

    const handleConfirm = async () => {
        if (!id) return
        if (confirmType == 'delete') {
            const res = await practicumModuleService.deleteData(id)
            toast.success(res.message)
        } else {
            const res = await practicumModuleService.toggleStatus(id)
            toast.success(res.message)
        }
        refresh()
        setConfirmOpen(false)
    }

    return (
        <>
            <Header title='Menu Modul Praktikum' />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0" ref={sectionRef}>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Modul Praktikum</CardTitle>
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
                                    options={practicums}
                                    value={selectedPracticum?.toString() || ''}
                                    onChange={(val) => {
                                        setSelectedPracticum(val ? Number(val) : 0)
                                        setCurrentPage(1)
                                    }}
                                    placeholder="Pilih Praktikum"
                                    optionLabelKey='name'
                                    optionValueKey='id'
                                    isFilter
                                />
                            </div>
                        </div>
                        <Table
                            data={practicumModules}
                            columns={PracticumModuleColumn({ openModal, openConfirm })}
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

                <ConfirmationDialog open={confirmOpen} onOpenChange={setConfirmOpen} onConfirm={handleConfirm} />
                <PracticumModuleFormDialog
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    data={practicumModules}
                    dataId={id}
                    practicums={practicums}
                    handleSave={handleSave}
                    title={type == 'Add' ? 'Tambah Modul Praktikum' : 'Edit Modul Praktikum'}
                />
            </div>
        </>
    )
}

export default PracticumModulePage