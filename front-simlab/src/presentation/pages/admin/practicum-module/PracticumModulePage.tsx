import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react"
import useTable from '@/application/hooks/useTable';
import { PracticumModuleService } from '@/application/practicum-module/PracticumModuleService';
import { PracticumModuleView } from '@/application/practicum-module/PracticumModuleView';
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
import PracticumModuleFormDialog from './components/PracticumModuleFormDIalog';
import { PracticumService } from '@/application/practicum/PracticumService';
import { PracticumSelectView } from '@/application/practicum/PracticumSelectView';
import { Combobox } from '@/presentation/components/custom/combobox';

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

    const practicumService = new PracticumService()
    const [practicums, setPracticums] = useState<PracticumSelectView[]>([])
    const [selectedPracticum, setSelectedPracticum] = useState<number>(0)

    useEffect(() => {
        const getPracticums = async () => {
            const response = await practicumService.getDataForSelect()
            setPracticums(response.data ?? [])
        }

        getPracticums()
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

    const practicumModuleService = new PracticumModuleService()
    const [practicumModule, setPracticumModule] = useState<PracticumModuleView[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const getData = async () => {
        setIsLoading(true)
        const response = await practicumModuleService.getPracticumModuleData({
            page: currentPage,
            per_page: perPage,
            search: searchTerm,
            filter_practicum: selectedPracticum
        })
        setPracticumModule(response.data ?? [])
        setTotalItems(response.total ?? 0)
        setTotalPages(response.last_page ?? 0)
        setIsLoading(false)
    }

    useEffect(() => {
        getData()
    }, [currentPage, perPage, selectedPracticum])

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
        getData()
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
        getData()
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
                            data={practicumModule}
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
                    data={practicumModule}
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