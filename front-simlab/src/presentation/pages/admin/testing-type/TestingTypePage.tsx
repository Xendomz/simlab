import { useEffect, useRef, useState } from "react"
import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react"
import Table from "../../../components/Table";
import { TestingTypeColumn } from "./TestingTypeColumn";
import useTable from "../../../../application/hooks/useTable";
import { ModalType } from "../../../../shared/Types";
import { TestingTypeInputDTO } from "../../../../application/testing-type/dtos/TestingTypeDTO";
import Header from "@/presentation/components/Header";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import ConfirmationDialog from "@/presentation/components/custom/ConfirmationDialog";
import TestingTypeFormDialog from "./components/TestingTypeFormDialog";
import { TestingTypeView } from "@/application/testing-type/TestingTypeView";
import { TestingTypeService } from "@/application/testing-type/TestingTypeService";

const TestingTypePage = () => {
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

    const testingTypeService = new TestingTypeService()
    const [testingTypes, setTestingTypes] = useState<TestingTypeView[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const getData = async () => {
        setIsLoading(true)
        const response = await testingTypeService.getTestingTypeData({
            page: currentPage,
            per_page: perPage,
            search: searchTerm,
        })
        setTestingTypes(response.data ?? [])
        setTotalItems(response.total ?? 0)
        setTotalPages(response.last_page ?? 0)
        setIsLoading(false)
    }

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

    const handleSave = async (formData: TestingTypeInputDTO): Promise<void> => {
        if (id) {
            const res = await testingTypeService.updateData(id, formData)
            toast.success(res.message)
        } else {
            const res = await testingTypeService.createData(formData)
            toast.success(res.message)
        }
        getData()
        setIsOpen(false)
    }

    const handleDelete = async () => {
        if (!id) return
        const res = await testingTypeService.deleteData(id)
        toast.success(res.message)

        getData()
        setConfirmOpen(false)
    }

    return (
        <>
            <Header title="Menu Jenis Pengujian" />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0" ref={sectionRef}>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Jenis Pengujian</CardTitle>
                        <CardAction>
                            <Button variant={"default"} onClick={() => openModal('Add')}>
                                Tambah
                                <Plus />
                            </Button>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <Table
                            data={testingTypes}
                            columns={TestingTypeColumn({ openModal, openConfirm })}
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
            <TestingTypeFormDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                data={testingTypes}
                dataId={id}
                handleSave={handleSave}
                title={type == 'Add' ? 'Tambah jenis pengujian' : 'Edit jenis pengujian'}
            />
        </>
    )
}

export default TestingTypePage